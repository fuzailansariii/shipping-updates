import { currentUserId } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { orderItems } from "@/utils/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";

// Initialize ImageKit with private key — server only
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> },
) {
  try {
    // Authenticate user
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // OrderItemId from param
    const { orderItemId } = await params;

    if (!orderItemId) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    // Fetch order item with Order, Product relation
    const item = await db.query.orderItems.findFirst({
      where: eq(orderItems.id, orderItemId),
      with: {
        orders: true,
        products: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      );
    }

    // Ownership check
    if (item.orders.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // Order payment status check
    if (item.orders.paymentStatus !== "completed") {
      return NextResponse.json(
        { success: false, error: "Order not paid" },
        { status: 403 },
      );
    }

    // Must be a PDF item
    if (item.productType !== "pdf") {
      return NextResponse.json(
        { success: false, error: "This item is not downloadable" },
        { status: 400 },
      );
    }

    // File must exists on the product
    if (!item.products.fileUrl) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 },
      );
    }

    const orderItemTitle = item.productTitle;

    // Atomic increment - this prevent race conditions if user clicks download twice simultaneously
    // Only increment if downloadCount < maxDownloads
    const updated = await db
      .update(orderItems)
      .set({
        downloadCount: sql`${orderItems.downloadCount} + 1`,
      })
      .where(
        and(
          eq(orderItems.id, orderItemId),
          lt(orderItems.downloadCount, orderItems.maxDownloads),
        ),
      )
      .returning();

    //   if nothing was updated, limit was already reached
    if (!updated.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Download limit reached",
          limitReached: true,
        },
        { status: 403 },
      );
    }

    const updatedItem = updated[0];

    // Strip base URL to get just the path for signing
    // e.g. https://ik.imagekit.io/yourapp/pdfs/book.pdf → /pdfs/book.pdf

    const filePath = item.products.fileUrl.replace(
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      "",
    );

    // generate signed url expire in 5 minutes
    const signedUrl = imagekit.url({
      path: filePath,
      signed: true,
      expireSeconds: 60,
    });

    let fileResponse;
    try {
      fileResponse = await axios.get(signedUrl, {
        responseType: "arraybuffer",
      });

      if (!fileResponse.data || fileResponse.status !== 200) {
        throw new Error("Empty or invalid file response");
      }
    } catch (fetchError: any) {
      // Rollback DB increment
      await db
        .update(orderItems)
        .set({ downloadCount: sql`${orderItems.downloadCount} - 1` })
        .where(eq(orderItems.id, orderItemId));

      console.error(
        "File fetch failed, rolled back count:",
        fetchError.message,
      );

      return NextResponse.json(
        { success: false, error: "Failed to fetch file, please try again" },
        { status: 500 },
      );
    }

    const safeTitle = orderItemTitle.replace(/[^a-zA-Z0-9\-_\s]/g, "").trim();
    const buffer = Buffer.from(fileResponse.data);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}-SU.pdf"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Download error:", error.message);

    return NextResponse.json(
      { success: false, error: "Failed to generate download link" },
      { status: 500 },
    );
  }
}
