import { isAdmin } from "@/lib/auth-helper";
import { pdfSchema } from "@/lib/validations/zod-schema";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/utils/db";
import { pdfs } from "@/utils/db/schema";

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validateData = pdfSchema.parse(body);

    const pdfId = nanoid();

    const [newPdf] = await db
      .insert(pdfs)
      .values({
        id: pdfId,
        title: validateData.title,
        description: validateData.description,
        fileSize: validateData.fileSize,
        fileUrl: validateData.fileUrl,
        pages: validateData.pages,
        price: validateData.price,
        topics: validateData.topics,
        thumbnail: validateData.thumbnail,
        isActive: validateData.isActive,
      })
      .returning();

    return NextResponse.json(
      { success: true, file: newPdf, message: "PDF saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Saving PDF");
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to save PDF" }, { status: 500 });
  }
}
