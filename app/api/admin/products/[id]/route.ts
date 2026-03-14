import { isAdmin } from "@/lib/auth-helper";
import { backendUpdateProductSchema } from "@/lib/validations/product.schema";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { validateId } from "@/lib/validations/id.schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidateTag } from "next/cache";

// GET
// Fetch single product (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = await checkRateLimit();
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 },
      );
    }
    const { id } = await params;
    const productId = validateId(id);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, product: product[0] },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching product:", message);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PATCH
// Update product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = await checkRateLimit();
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access is required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const productId = validateId(id);

    const body = await request.json();

    const parsed = backendUpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: z.treeifyError(parsed.error),
        },
        { status: 400 },
      );
    }

    const validatedData = parsed.data;

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 },
      );
    }

    const updateData = {
      ...validatedData,
      price: Number(validatedData.price),
      updatedAt: new Date(),
    };

    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidateTag("products", "max");
    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct[0],
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating product:", message);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE
// Soft delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = await checkRateLimit();
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access is required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const productId = validateId(id);

    const deletedProduct = await db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    if (!deletedProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidateTag("products", "max");
    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting product:", message);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
