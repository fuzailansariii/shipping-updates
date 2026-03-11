import { validateAdminRequest } from "@/lib/api-helper";
import { updateOrderSchema } from "@/lib/validations/updateOrder.schema";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// GET Order by orderID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await validateAdminRequest(params);
    if ("response" in result) return result.response;
    const { orderId } = result;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { items: true },
    });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Order fetched successfully", data: order },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// update(PATCH) Order by orderID - Admin Only
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await validateAdminRequest(params);
    if ("response" in result) return result.response;
    const { orderId } = result;

    const body = await _req.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    // update object
    const updateData: Record<string, unknown> = {
      ...parsed.data,
      updatedAt: new Date(),
    };
    // auto timestamp based on status
    if (parsed.data.orderStatus === "shipped") {
      updateData.shippedAt = new Date();
    }

    if (parsed.data.orderStatus === "delivered") {
      updateData.deliveredAt = new Date();
    }

    // run update
    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        data: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}
