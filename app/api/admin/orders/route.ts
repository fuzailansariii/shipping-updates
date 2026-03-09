import { requireAdmin } from "@/lib/api-helper";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check admin
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;

    // Pagination params from URL
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
    const offset = (page - 1) * limit;

    // Run both queries in parallel — total count + paginated data
    const [result, totalResult] = await Promise.all([
      db.query.orders.findMany({
        with: { items: true },
        orderBy: desc(orders.createdAt),
        limit,
        offset,
      }),
      db.select({ count: sql<number>`count(*)` }).from(orders),
    ]);

    const total = Number(totalResult[0].count);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Orders fetched successfully",
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
