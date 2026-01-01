import { isAdmin } from "@/lib/auth-helper";
import { updatePdfSchema } from "@/lib/validations/zod-schema";
import { db } from "@/utils/db";
import { pdfs } from "@/utils/db/schema";
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

    const { id: pdfId } = await params;

    const pdf = await db.select().from(pdfs).where(eq(pdfs.id, pdfId));

    if (!pdf.length) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, pdf: pdf[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDF", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
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

    const { id: pdfId } = await params;
    const body = await request.json();

    const parsed = updatePdfSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.message },
        { status: 400 }
      );
    }

    const validateData = parsed.data;

    if (Object.keys(validateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const updatedPdf = await db
      .update(pdfs)
      .set(validateData)
      .where(eq(pdfs.id, pdfId))
      .returning();

    if (!updatedPdf.length) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "PDF Updated successfully",
        pdf: updatedPdf[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Updating PDF", error);
    return NextResponse.json(
      { error: "Failed to update PDF" },
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

    const { id: pdfId } = await params;

    const deletePDF = await db
      .delete(pdfs)
      .where(eq(pdfs.id, pdfId))
      .returning();

    if (!deletePDF.length) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "PDF deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Deleting PDF", error);
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 }
    );
  }
}
