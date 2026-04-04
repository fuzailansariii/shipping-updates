import { messageSchema } from "@/lib/validations/message.schema";
import { db } from "@/utils/db";
import { contactMessages } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { currentUserId } from "@/lib/auth-helper";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Optional auth
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const rateLimitResult = await checkRateLimit(request, userId, "general");
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests, please slow down" },
        { status: 429 },
      );
    }

    // Validate body
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid inputs", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, message, name, subject } = parsed.data;

    // Insert
    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        id: nanoid(),
        email: email.trim(),
        name: name.trim(),
        subject: subject.trim(),
        message: message.trim(),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Message created successfully",
        data: newMessage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating message", error);

    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 },
    );
  }
}
