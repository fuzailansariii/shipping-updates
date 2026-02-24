import { isAuthenticated, currentUserId } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Please sign in to view orders",
        },
        { status: 401 },
      );
    }

    const { orderId } = await params;

    // Relational query to get order with items with security check
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.clerkUserId, userId)),
      with: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or you don't have permission to view it",
        },
        { status: 404 },
      );
    }

    // return fetched order
    return NextResponse.json(
      {
        success: true,
        message: `Order #${order.orderNumber} retrieved successfully`,
        data: order, // contains order + items array
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order - Please try again later",
      },
      { status: 500 },
    );
  }
}

const updateOrderSchema = z.object({
  paymentStatus: z.enum(["pending", "completed", "failed", "refunded"]),
  orderStatus: z.enum([
    "pending",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
    "failed",
  ]),
  paymentId: z.string().min(1, "Payment ID is required"),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    // Auth check
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Please sign in to view orders",
        },
        { status: 401 },
      );
    }

    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Validate body
    const body = await req.json();
    const parsedData = updateOrderSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const { paymentStatus, orderStatus, paymentId } = parsedData.data;

    // Verify order exists and belongs to user
    const existingOrder = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.clerkUserId, userId)),
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or you don't have permission to update it",
        },
        { status: 404 },
      );
    }

    // Prevent double payment
    if (existingOrder.paymentStatus === "completed") {
      return NextResponse.json(
        { success: false, error: "Order has already been paid" },
        { status: 400 },
      );
    }

    // Update order
    const [updatedOrder] = await db
      .update(orders)
      .set({
        paymentStatus,
        orderStatus,
        razorpayPaymentId: paymentId,
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.clerkUserId, userId)))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: `Order #${updatedOrder.orderNumber} confirmed successfully`,
        data: {
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.orderNumber,
          paymentStatus: updatedOrder.paymentStatus,
          orderStatus: updatedOrder.orderStatus,
          totalAmount: updatedOrder.totalAmount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order - Please try again later",
      },
      { status: 500 },
    );
  }
}
