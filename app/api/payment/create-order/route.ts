import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

const razorpay = new Razorpay({
  key_id: process.env.TEST_RAZORPAY_KEY_ID!,
  key_secret: process.env.TEST_RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // rate limit check
    const rateLimitResult = await checkRateLimit(
      request,
      userId,
      "paymentCreate",
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests, please slow down" },
        { status: 429 },
      );
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID required" },
        { status: 400 },
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order || order.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    if (order.paymentStatus !== "pending") {
      return NextResponse.json(
        { success: false, error: "Order already paid" },
        { status: 400 },
      );
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount,
      currency: "INR",
      receipt: order.orderNumber,
    });

    await db
      .update(orders)
      .set({ razorpayOrderId: razorpayOrder.id })
      .where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
