import Overview from "@/components/admin/overview";
import {
  getOverviewStats,
  getRecentOrders,
  getRecentMessages,
  getTopSellingProducts,
  getLowStockProducts,
} from "@/lib/admin/overview-querys";

export const revalidate = 60;

export default async function OverviewPage() {
  const [stats, orders, messages, topProducts, lowStock] = await Promise.all([
    getOverviewStats(),
    getRecentOrders(),
    getRecentMessages(),
    getTopSellingProducts(),
    getLowStockProducts(),
  ]);

  return (
    <Overview
      stats={stats}
      orders={orders}
      messages={messages}
      topProducts={topProducts}
      lowStock={lowStock}
    />
  );
}
