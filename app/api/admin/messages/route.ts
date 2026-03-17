import { isAdmin } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { contactMessages } from "@/utils/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access required" },
        { status: 401 },
      );
    }

    const messages = await db.select().from(contactMessages);

    return NextResponse.json(
      {
        success: true,
        message: "Message fetched successfully",
        data: messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
