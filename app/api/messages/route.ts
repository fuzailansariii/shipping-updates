import { isAdmin } from "@/lib/auth-helper";
import { messageSchema } from "@/lib/validations/zod-schema";
import { db } from "@/utils/db";
import { contactMessages } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, Admin access required" },
        { status: 401 }
      );
    }

    const messages = await db.select().from(contactMessages);
    if (messages.length === 0) {
      return NextResponse.json({ error: "No Messages found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message fetched successfully",
        data: messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST Method to create message to the contactMessage Table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid Inputs", issue: parsed.error },
        { status: 400 }
      );
    }
    const messageId = nanoid();

    const { email, message, name, subject } = parsed.data;

    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        id: messageId,
        email: email.trim(),
        message: message.trim(),
        name: name.trim(),
        subject,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Message created successfully",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating message", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
