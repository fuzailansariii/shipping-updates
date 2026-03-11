import { isAdmin } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { contactMessages } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (typeof body.isRead !== "boolean") {
      return NextResponse.json(
        { error: "isRead must be a boolean" },
        { status: 400 },
      );
    }

    await db
      .update(contactMessages)
      .set({ isRead: body.isRead })
      .where(eq(contactMessages.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating message", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 },
    );
  }
}
