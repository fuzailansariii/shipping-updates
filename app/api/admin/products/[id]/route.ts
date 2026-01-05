import { buildProductValues, isAdmin } from "@/lib/auth-helper";
import { updateProductSchema } from "@/lib/validations/zod-schema";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch single PDF (admin only - includes fileUrl)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }

    const { id: productId } = await params;

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, product: product[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH - Update PDF (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access is required" },
        { status: 403 }
      );
    }

    const { id: productId } = await params;
    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.message },
        { status: 400 }
      );
    }

    const validatedData = parsed.data;

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // only include fields that were provided
    const updateData = {
      ...validatedData,
      price: Number(validatedData.price),
      updatedAt: new Date(),
    };

    // Update PDF
    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Updated successfully",
        pdf: updatedProduct[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Updating Product", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Pdf (admin only)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access is required" },
        { status: 403 }
      );
    }

    const { id: productId } = await params;

    const deleteProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (!deleteProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Deleting Product", error);
    return NextResponse.json(
      { error: "Failed to delete Product" },
      { status: 500 }
    );
  }
}
