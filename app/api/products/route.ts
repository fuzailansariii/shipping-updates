import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // fetch safe fields for public browsing
    const productData = await db
      .select({
        type: products.type,
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        fileSize: products.fileSize,
        topics: products.topics,
        thumbnail: products.thumbnail,
        isActive: products.isActive,
        createdAt: products.createdAt,
        author: products.author,
        publisher: products.publisher,
        stockQuantity: products.stockQuantity,
        language: products.language,
        isFeatured: products.isFeatured,
      })
      .from(products)
      .where(eq(products.isActive, true)); // Only show active Products

    return NextResponse.json(
      { success: true, products: productData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Products", error);
    return NextResponse.json(
      { error: "Failed to fetch Products" },
      { status: 500 }
    );
  }
}
