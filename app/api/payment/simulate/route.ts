import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { inventoryLogs, orderItems, orders, products } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    const { orderId, amount } = await req.json();

    // Validate inputs
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "Order ID and amount are required" },
        { status: 400 },
      );
    }

    // Verify order exists and belongs to user
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // ownership check
    if (order.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Amount check
    const amountDifference = Math.abs(order.totalAmount - amount);
    if (amountDifference > 0.01) {
      return NextResponse.json(
        {
          success: false,
          error: `Amount mismatch. Expected: ₹${order.totalAmount}, Received: ₹${amount}`,
        },
        { status: 400 },
      );
    }

    // Simulate payment processing delay (1-2 seconds)
    const delay = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate 95% success rate
    const isSuccessful = Math.random() > 0.05;

    if (isSuccessful) {
      // Generate simulated payment ID
      const paymentId = `sim_pay_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const updatedOrders = await db
        .update(orders)
        .set({
          paymentStatus: "completed",
          orderStatus: "confirmed",
          razorpayPaymentId: paymentId,
        })
        .where(
          and(eq(orders.id, order.id), eq(orders.paymentStatus, "pending")),
        )
        .returning();

      if (updatedOrders.length === 0) {
        return NextResponse.json(
          { success: false, error: "Order already paid or not found" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Payment successful (simulated)",
          data: {
            paymentId,
            orderId,
            orderNumber: order.orderNumber,
            amount,
            status: "success",
            paidAt: new Date().toISOString(),
          },
        },
        { status: 200 },
      );
    } else {
      // Simulate random failure reason
      const failureReasons = [
        "Insufficient funds",
        "Card declined",
        "Bank server timeout",
        "Invalid card details",
      ];
      const reason =
        failureReasons[Math.floor(Math.random() * failureReasons.length)];

      // Everything in one transaction
      await db.transaction(async (tx) => {
        // Get all order items
        const items = await tx.query.orderItems.findMany({
          where: eq(orderItems.orderId, orderId),
        });

        // Restore stock for each book item
        for (const item of items) {
          if (item.productType === "book") {
            const product = await tx.query.products.findFirst({
              where: eq(products.id, item.productId),
            });

            if (product) {
              const previousStock = product.stockQuantity;
              const newStock = previousStock + item.quantity;

              await tx
                .update(products)
                .set({ stockQuantity: newStock })
                .where(eq(products.id, item.productId));

              await tx.insert(inventoryLogs).values({
                id: nanoid(),
                productId: item.productId,
                action: "adjustment",
                quantity: item.quantity,
                previousStock,
                newStock,
                reason: `Payment failed for Order #${order.orderNumber}`,
                createdBy: userId,
              });
            }
          }
        }

        // Update order status — all in the same transaction
        await tx
          .update(orders)
          .set({ paymentStatus: "failed", orderStatus: "failed" })
          .where(eq(orders.id, orderId));
      });

      return NextResponse.json(
        {
          success: false,
          error: `Payment failed: ${reason} (simulated)`,
          data: { orderId, status: "failed", reason },
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Simulated payment error:", error);
    return NextResponse.json(
      { success: false, error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
