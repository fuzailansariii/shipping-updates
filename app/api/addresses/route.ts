import { NextRequest, NextResponse } from "next/server";
import { addressApiSchema } from "@/lib/validations/zod-schema";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { addresses } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const parsedData = addressApiSchema.safeParse({
      ...body,
      clerkUserId: userId,
    });

    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Invalid Inputs",
          fieldErrors: z.treeifyError(parsedData.error),
        },
        { status: 400 },
      );
    }

    const addressData = parsedData.data;

    // If this address is set as default, unset all other defaults for this user
    if (addressData.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.clerkUserId, userId));
    }

    // Save new address to the db
    const [newAddress] = await db
      .insert(addresses)
      .values({
        id: nanoid(),
        clerkUserId: userId,
        fullName: addressData.fullName,
        phone: addressData.phone,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 ?? null,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        landmark: addressData.landmark ?? null,
        isDefault: addressData.isDefault,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Address Created Successfully",
        data: newAddress,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating address", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressesData = await db
      .select()
      .from(addresses)
      .where(eq(addresses.clerkUserId, userId));

    if (addressesData.length === 0) {
      return NextResponse.json(
        { message: "No address found", data: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Address fetched Successfully", data: addressesData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fething addresses");
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}
