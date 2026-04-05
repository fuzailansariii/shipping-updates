import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // rate limit check
    const rateLimitResult = await checkRateLimit(
      request,
      userId,
      "paymentVerify",
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests, please slow down" },
        { status: 429 },
      );
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await request.json();

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Update order — idempotent (safe if webhook already updated it)
    await db
      .update(orders)
      .set({
        paymentStatus: "completed",
        orderStatus: "confirmed",
        razorpayPaymentId,
      })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.clerkUserId, userId),
          eq(orders.paymentStatus, "pending"),
        ),
      );
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
