import AdminOrderModal from "@/components/admin/orders/admin-order-modal";
import OrdersClient from "@/components/admin/orders/order-client";
import ErrorState from "@/components/admin/shared/error-state";
import { isAdmin } from "@/lib/auth-helper";
import { OrderWithItems } from "@/types";
import { db } from "@/utils/db";
import { Order, OrderItem, orders } from "@/utils/db/schema";
import { desc, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

interface OrderPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/sign-in");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = 20;
  const offset = (currentPage - 1) * limit;
  let allOrders: OrderWithItems[] = [];
  let total = 0;
  let totalPages = 0;

  try {
    const [fetchOrders, totalResult] = await Promise.all([
      db.query.orders.findMany({
        with: { items: true },
        orderBy: desc(orders.createdAt),
        limit,
        offset,
      }),
      db.select({ count: sql<number>`count(*)` }).from(orders),
    ]);

    allOrders = fetchOrders;
    total = Number(totalResult[0].count);
    totalPages = Math.ceil(total / limit);
  } catch (error) {
    console.error("Failed to fetch orders: ", error);
    return <ErrorState message="Failed to load orders" />;
  }

  return (
    <>
      <OrdersClient
        orders={allOrders}
        pagination={{ currentPage, total, totalPages }}
      />
      <AdminOrderModal />
    </>
  );
}
