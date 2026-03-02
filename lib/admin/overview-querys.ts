import { Status } from "@/components/admin/shared/status-badge";
import { db } from "@/utils/db";
import {
  contactMessages,
  orderItems,
  orders,
  products,
} from "@/utils/db/schema";
import { formatDate } from "@/utils/pdf-helper";
import { asc, count, countDistinct, desc, eq, lt, sum } from "drizzle-orm";

// Overview Stats with explicit return types
export async function getOverviewStats(): Promise<{
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}> {
  try {
    const [totalProducts, totalRevenue, pendingOrders, totalCustomers] =
      await Promise.all([
        // total active products
        db
          .select({ count: count() })
          .from(products)
          .where(eq(products.isActive, true)),

        // total revenue from completed orders only
        db
          .select({ total: sum(orders.totalAmount) })
          .from(orders)
          .where(eq(orders.paymentStatus, "completed")),

        // pending orders count
        db
          .select({ count: count() })
          .from(orders)
          .where(eq(orders.orderStatus, "pending")),

        // total unique customers
        //   db.selectDistinct({ clerkUserId: orders.clerkUserId }).from(orders),
        db.select({ count: countDistinct(orders.clerkUserId) }).from(orders),
      ]);

    return {
      totalProducts: totalProducts[0]?.count ?? 0,
      totalRevenue: Number(totalRevenue[0]?.total ?? 0),
      pendingOrders: pendingOrders[0]?.count ?? 0,
      totalCustomers: totalCustomers[0]?.count ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch overview stats: ", error);
    return {
      pendingOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      totalRevenue: 0,
    };
  }
}

// Recent Orders
export async function getRecentOrders(): Promise<
  {
    id: string;
    orderNumber: string;
    customer: string;
    product: string;
    amount: number;
    status: Status;
  }[]
> {
  try {
    const result = await db.query.orders.findMany({
      limit: 5,
      orderBy: desc(orders.createdAt),
      with: { items: true },
    });

    return result.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.buyerName,
      product: order.items[0]?.productTitle ?? "-",
      amount: order.totalAmount,
      status: order.orderStatus ?? "failed",
    }));
  } catch (error) {
    console.error("Failed to fetch recent orders: ", error);
    return [];
  }
}

// Recent Messages
export async function getRecentMessages(): Promise<
  {
    id: string;
    customer: string;
    subject: string | null;
    message: string;
    time: string;
  }[]
> {
  try {
    const result = await db.query.contactMessages.findMany({
      limit: 5,
      orderBy: desc(contactMessages.createdAt),
    });

    return result.map((message) => ({
      id: message.id,
      customer: message.name,
      subject: message.subject,
      message: message.message,
      time: message.createdAt
        ? formatDate(message.createdAt.toISOString())
        : "-",
    }));
  } catch (error) {
    console.error("Failed to fetch recent messages: ", error);
    return [];
  }
}

// top selling products
export async function getTopSellingProducts(): Promise<
  {
    id: string;
    title: string;
    type: "pdf" | "book";
    sold: number;
    revenue: number;
  }[]
> {
  try {
    const soldSum = sum(orderItems.quantity);
    const revenueSum = sum(orderItems.totalPrice);

    const result = await db
      .select({
        id: products.id,
        title: products.title,
        type: products.type,
        sold: soldSum,
        revenue: revenueSum,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .groupBy(products.id, products.title, products.type)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(5);

    return result.map((item) => ({
      id: item.id ?? "",
      title: item.title ?? "unknown",
      type: item.type!,
      sold: Number(item.sold ?? 0),
      revenue: Number(item.revenue ?? 0),
    }));
  } catch (error) {
    console.error("Failed to fetch top selling products: ", error);
    return [];
  }
}

// low stock products
export async function getLowStockProducts(): Promise<
  {
    id: string;
    title: string;
    stock: number;
  }[]
> {
  try {
    const result = await db.query.products.findMany({
      where: lt(products.stockQuantity, 10),
      orderBy: asc(products.stockQuantity),
      limit: 5,
      columns: {
        id: true,
        title: true,
        stockQuantity: true,
      },
    });

    return result.map((item) => ({
      id: item.id,
      title: item.title,
      stock: item.stockQuantity,
    }));
  } catch (error) {
    console.error("Failed to fetch low stock products: ", error);
    return [];
  }
}
