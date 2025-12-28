import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { pdfs } from "@/utils/db/schema";
import { isAdmin } from "@/lib/auth-helper";
import { pdfSchemaProcessed } from "@/lib/validations/zod-schema";
import { nanoid } from "nanoid";
import { ZodError } from "zod";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }

    const pdfData = await db.select().from(pdfs);

    return NextResponse.json({ success: true, pdfs: pdfData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDFs", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}

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
    const validateData = pdfSchemaProcessed.parse(body);

    const pdfId = nanoid();

    const [newPdf] = await db
      .insert(pdfs)
      .values({
        id: pdfId,
        title: validateData.title,
        description: validateData.description,
        fileSize: validateData.fileSize,
        fileUrl: validateData.fileUrl,
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
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to save PDF" }, { status: 500 });
  }
}
