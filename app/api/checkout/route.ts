import { checkoutSchema } from "@/lib/validations/zod-schema";
import { db } from "@/utils/db";
import { generateOrderId } from "@/utils/db/order-id";
import { orderItems, orders, products } from "@/utils/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = checkoutSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsedData.error) },
        { status: 400 }
      );
    }

    const {
      clerkUserId,
      buyerEmail,
      buyerName,
      buyerPhone,
      discount,
      items,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      shippingCharges,
      subTotal,
      tax,
      totalAmount,
      billingAddress,
      notes,
      //   razorpayOrderId,
      //   razorpayPaymentId,
    } = parsedData.data;

    const orderId = nanoid();
    const orderNumber = generateOrderId();
    const now = new Date();

    // Start a transaction (if using Drizzle's transaction API)
    // This ensures both order and orderItems are created together
    try {
      await db.transaction(async (tx) => {
        // insert Orders
        await tx.insert(orders).values({
          id: orderId,
          clerkUserId,
          orderNumber,
          buyerEmail,
          buyerName,
          buyerPhone,
          subTotal,
          tax,
          shippingCharges,
          totalAmount,
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
          paymentMethod: paymentMethod || "online",
          discount,
          paymentStatus: paymentStatus || "pending",
          orderStatus: "pending", // Initial status
          awbNumber: null,
          courierPartner: null,
          shippedAt: null,
          deliveredAt: null,
          notes: notes || null,
          razorpayOrderId: null,
          razorpayPaymentId: null,
          createdAt: now,
          updatedAt: now,
        });

        // Prepare OrderItemsData
        const orderItemsData = items.map((item) => ({
          id: nanoid(),
          orderId,
          productId: item.productId,
          productType: item.productType,
          productTitle: item.productTitle,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          unitPrice: item.unitPrice,
          downloadCount: 0,
          maxDownloads: item.productType === "pdf" ? 3 : 0,
          createdAt: now,
        }));

        // Insert OrderItems
        await tx.insert(orderItems).values(orderItemsData);
        //   Reduce stock quantity for physical books.
        for (const item of items) {
          if (item.productType === "book") {
            await tx
              .update(products)
              .set({
                stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
              })
              .where(eq(products.id, item.productId));
          }
        }
      });

      // Return success + order id
      return NextResponse.json(
        {
          success: true,
          message: "Order created successfully",
          data: { orderId, orderNumber, totalAmount },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Database transaction error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create order in database",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error during checkout" },
      { status: 500 }
    );
  }
}
