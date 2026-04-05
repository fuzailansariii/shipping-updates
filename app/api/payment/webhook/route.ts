  import { db } from "@/utils/db";
  import { inventoryLogs, orderItems, orders, products } from "@/utils/db/schema";
  import crypto from "crypto";
  import { and, eq } from "drizzle-orm";
  import { nanoid } from "nanoid";
  import { NextRequest, NextResponse } from "next/server";

  export async function POST(request: NextRequest) {
    try {
      const rawBody = await request.text();
      const signature = request.headers.get("x-razorpay-signature");

      if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
      }

      // verify webhook signature
      const expectedSignature = crypto
        .createHmac("sha256", process.env.WEBHOOK_SECRET_KEY!)
        .update(rawBody)
        .digest("hex");

      // check if valid signature
      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

      const event = JSON.parse(rawBody);
      const eventType = event.event;

      // handle payment capture
      if (eventType === "payment.captured") {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        // Find order by razorpay order id
        const order = await db.query.orders.findFirst({
          where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (!order) {
          console.error(
            "Webhook: Order not found for razorpayOrderId:",
            razorpayOrderId,
          );
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        // Idempotent — skip if already completed
        if (order.paymentStatus === "completed") {
          return NextResponse.json({
            success: true,
            message: "Already processed",
          });
        }

        // Update order
        await db
          .update(orders)
          .set({
            paymentStatus: "completed",
            orderStatus: "confirmed",
            razorpayPaymentId,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, order.id));
      }

      // Handle payment failed
      if (eventType === "payment.failed") {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await db.query.orders.findFirst({
          where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (!order || order.paymentStatus !== "pending") {
          return NextResponse.json({ success: true });
        }

        // Restore stock and mark failed in transaction
        await db.transaction(async (tx) => {
          const items = await tx.query.orderItems.findMany({
            where: eq(orderItems.orderId, order.id),
          });

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

                // update inventory log
                await tx.insert(inventoryLogs).values({
                  id: nanoid(),
                  productId: item.productId,
                  action: "adjustment",
                  quantity: item.quantity,
                  previousStock,
                  newStock,
                  reason: `Payment failed for Order #${order.orderNumber}`,
                  createdBy: "system",
                });
              }
            }
          }
          await tx
            .update(orders)
            .set({ paymentStatus: "failed", orderStatus: "failed" })
            .where(eq(orders.id, order.id));
        });
      }
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 },
      );
    }
  }
