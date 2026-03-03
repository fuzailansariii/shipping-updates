"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminMenuCard from "./admin-menu-card";
import MessagesList from "./messages/messages-list";
import LowStockList from "./stocks/low-stock-list";
import RecentOrderTable from "./orders/recent-order-table";
import { Status } from "./shared/status-badge";
import TopSellingProducts from "./products/top-selling-table";

type Props = {
  stats: {
    totalProducts: number;
    totalRevenue: number;
    pendingOrders: number;
    totalCustomers: number;
  };
  orders: {
    id: string;
    orderNumber: string;
    customer: string;
    product: string;
    amount: number;
    status: Status;
  }[];
  messages: {
    id: string;
    customer: string;
    subject: string;
    message: string;
    time: string;
  }[];
  topProducts: {
    id: string;
    title: string;
    type: "book" | "pdf";
    sold: number;
    revenue: number;
  }[];
  lowStock: {
    id: string;
    title: string;
    stock: number;
  }[];
};

export default function Overview({
  stats,
  orders,
  messages,
  topProducts,
  lowStock,
}: Props) {
  const { totalProducts, totalRevenue, pendingOrders, totalCustomers } = stats;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">Overview</h1>
          <p className="mt-1 text-sm text-secondary-dark/50">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminMenuCard title="Products" count={totalProducts} />
          <AdminMenuCard title="Revenue" count={totalRevenue} isCurrency />
          <AdminMenuCard title="Pending Orders" count={pendingOrders} />
          <AdminMenuCard title="Customers" count={totalCustomers} />
        </div>

        {/* Recent Order Table + Messages */}

        <RecentOrderTable orders={orders} />
        <TopSellingProducts products={topProducts} />

        {/* Top Selling Products + Low Stock */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Top Selling Products + Low Stock */}
          <MessagesList messages={messages} />

          <LowStockList products={lowStock} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
