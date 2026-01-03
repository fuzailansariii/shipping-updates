import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // fetch safe fields for public browsing
    const pdfData = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        fileSize: products.fileSize,
        topics: products.topics,
        thumbnail: products.thumbnail,
        isActive: products.isActive,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.isActive, true)); // Only show active PDFs

    return NextResponse.json({ success: true, pdfs: pdfData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDFs", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}
