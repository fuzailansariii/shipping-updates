import { calculatePricing } from "@/lib/pricing";
import { previewSchema } from "@/lib/validations/product.schema";
import { CheckoutPreviewResponse, SafeItem } from "@/types/checkout";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = previewSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 },
      );
    }

    const { items } = parsedData.data;

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 },
      );
    }

    const productIds = items.map((item) => item.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "Some products not found" },
        { status: 400 },
      );
    }

    const productMap = new Map(
      dbProducts.map((product) => [product.id, product]),
    );

    const pricingInput = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        price: product.price,
        quantity: item.quantity,
        type: product.type,
      };
    });

    const pricing = calculatePricing(pricingInput);

    // Return only pricing, not items
    return NextResponse.json({
      success: true,
      data: pricing, // Just { subTotal, tax, shippingCharges, totalAmount }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to calculate preview" },
      { status: 500 },
    );
  }
}
