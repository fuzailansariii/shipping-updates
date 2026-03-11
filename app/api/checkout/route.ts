import { calculatePricing } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/validations/order.schema";
import { db } from "@/utils/db";
import { generateOrderNumber } from "@/utils/db/order-id";
import { inventoryLogs, orderItems, orders, products } from "@/utils/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helper";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsedData = checkoutSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: parsedData.error.flatten() },
        { status: 400 },
      );
    }

    const {
      buyerEmail,
      buyerName,
      buyerPhone,
      items,
      shippingAddress,
      billingAddress,
      notes,
    } = parsedData.data;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 },
      );
    }

    const orderId = nanoid();
    const orderNumber = generateOrderNumber();
    const now = new Date();

    try {
      const result = await db.transaction(async (tx) => {
        const productIds = items.map((item) => item.productId);

        const dbProducts = await tx
          .select()
          .from(products)
          .where(inArray(products.id, productIds));

        if (dbProducts.length !== productIds.length) {
          throw new Error("Some products not found");
        }

        const productMap = new Map(
          dbProducts.map((product) => [product.id, product]),
        );

        // Build safe order items
        const safeOrderItems = items.map((item) => {
          const product = productMap.get(item.productId);

          if (!product) {
            throw new Error("Product not found");
          }

          if (
            product.type === "book" &&
            product.stockQuantity < item.quantity
          ) {
            throw new Error(`Not enough stock for ${product.title}`);
          }
          if (!product.isActive) {
            throw new Error(`${product.title} is not available`);
          }

          const unitPrice = product.price;
          const totalPrice = unitPrice * item.quantity;

          return {
            id: nanoid(),
            orderId,
            productId: product.id,
            productType: product.type,
            productTitle: product.title,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
            downloadCount: 0,
            maxDownloads: product.type === "pdf" ? 3 : 0,
            createdAt: now,
          };
        });

        //  calculatePricing (same as preview endpoint)
        const pricingInput = safeOrderItems.map((item) => ({
          price: item.unitPrice,
          quantity: item.quantity,
          type: item.productType,
        }));

        const pricing = calculatePricing(pricingInput);

        // Insert order with calculated pricing
        await tx.insert(orders).values({
          id: orderId,
          clerkUserId: user.id,
          orderNumber,
          buyerEmail,
          buyerName,
          buyerPhone,
          subTotal: pricing.subTotal,
          tax: pricing.tax,
          shippingCharges: pricing.shippingCharges,
          totalAmount: pricing.totalAmount,
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
          paymentMethod: "razorpay",
          paymentStatus: "pending",
          orderStatus: "pending",
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

        // insert order items
        await tx.insert(orderItems).values(safeOrderItems);

        // Stock deduction
        for (const item of safeOrderItems) {
          if (item.productType === "book") {
            // current stock before update
            const [currentProduct] = await tx
              .select({ stockQuantity: products.stockQuantity })
              .from(products)
              .where(eq(products.id, item.productId));

            const previousStock = currentProduct.stockQuantity;
            const newStock = previousStock - item.quantity;
            const updated = await tx
              .update(products)
              .set({
                stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
              })
              .where(
                sql`${products.id} = ${item.productId}
                    AND ${products.stockQuantity} >= ${item.quantity}`,
              )
              .returning();

            if (updated.length === 0) {
              throw new Error("Stock update failed");
            }

            // log inventory change
            await tx.insert(inventoryLogs).values({
              id: nanoid(),
              productId: item.productId,
              action: "sale",
              quantity: -item.quantity,
              previousStock: previousStock,
              newStock: newStock,
              reason: `Order ${orderNumber}`,
              createdBy: user.id,
              createdAt: now,
            });
          }
        }

        return {
          orderId,
          orderNumber,
          totalAmount: pricing.totalAmount,
        };
      });

      return NextResponse.json(
        {
          success: true,
          message: "Order created successfully",
          data: result,
        },
        { status: 201 },
      );
    } catch (error: any) {
      console.error("Transaction error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Order creation failed",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
