import { isAuthenticated, currentUserId } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
