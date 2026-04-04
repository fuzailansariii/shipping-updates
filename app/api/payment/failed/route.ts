import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { orders, orderItems, products, inventoryLogs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false }, { status: 401 });

    const { orderId } = await req.json();

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (
      !order ||
      order.clerkUserId !== userId ||
      order.paymentStatus !== "pending"
    ) {
      return NextResponse.json({ success: true });
    }

    await db.transaction(async (tx) => {
      const items = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId),
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

      await tx
        .update(orders)
        .set({ paymentStatus: "failed", orderStatus: "failed" })
        .where(eq(orders.id, orderId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
