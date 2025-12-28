import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { pdfs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // fetch safe fields for public browsing
    const pdfData = await db
      .select({
        id: pdfs.id,
        title: pdfs.title,
        description: pdfs.description,
        price: pdfs.price,
        fileSize: pdfs.fileSize,
        topics: pdfs.topics,
        thumbnail: pdfs.thumbnail,
        isActive: pdfs.isActive,
        createdAt: pdfs.createdAt,
      })
      .from(pdfs)
      .where(eq(pdfs.isActive, true)); // Only show active PDFs

    return NextResponse.json({ success: true, pdfs: pdfData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDFs", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}
