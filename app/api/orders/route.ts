import { isAuthenticated, currentUserId } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    // relational query to get all orders with items
    const allOrders = await db.query.orders.findMany({
      where: eq(orders.clerkUserId, userId),
      with: { items: true },
      orderBy: desc(orders.createdAt),
    });

    if (allOrders.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No orders found - Start shopping to see your orders here",
          data: {
            orders: [],
            totalOrders: 0,
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Found ${allOrders.length} order(s)`,
        data: {
          orders: allOrders, // each order contains items array
          totalOrders: allOrders.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders - Please try again later",
      },
      { status: 500 },
    );
  }
}
