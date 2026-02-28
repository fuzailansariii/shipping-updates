import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminMenuCard from "./admin-menu-card";
import Link from "next/link";

const recentOrders = [
  {
    id: "1",
    orderNumber: "#1023",
    customer: "Rahul Kumar",
    product: "Book A",
    amount: 499,
    status: "pending",
  },
  {
    id: "2",
    orderNumber: "#1022",
    customer: "Priya Singh",
    product: "PDF Guide",
    amount: 199,
    status: "delivered",
  },
  {
    id: "3",
    orderNumber: "#1021",
    customer: "Amit Verma",
    product: "Book B",
    amount: 599,
    status: "shipped",
  },
  {
    id: "4",
    orderNumber: "#1020",
    customer: "Sneha Rao",
    product: "Book A",
    amount: 499,
    status: "processing",
  },
  {
    id: "5",
    orderNumber: "#1019",
    customer: "Karan Shah",
    product: "PDF Guide",
    amount: 199,
    status: "cancelled",
  },
];

const recentMessages = [
  {
    id: "1",
    customer: "Rahul Kumar",
    message:
      "Hi, I have a question about my recent order #1023. Can you please assist?",
    time: "2m ago",
  },
  {
    id: "2",
    customer: "Priya Singh",
    message: "When will my book be shipped? I ordered 3 days ago.",
    time: "15m ago",
  },
  {
    id: "3",
    customer: "Amit Verma",
    message: "The PDF I downloaded seems to be corrupted. Please help.",
    time: "1h ago",
  },
  {
    id: "4",
    customer: "Sneha Rao",
    message: "Can I get a refund for my order #1020?",
    time: "3h ago",
  },
  {
    id: "5",
    customer: "Karan Shah",
    message: "Is there a combo pack available for Book A and B?",
    time: "5h ago",
  },
];

const topSellingProducts = [
  { id: "1", title: "Book A", type: "Physical", sold: 142, revenue: 70858 },
  { id: "2", title: "PDF Guide", type: "PDF", sold: 98, revenue: 19502 },
  { id: "3", title: "Book B", type: "Physical", sold: 76, revenue: 45524 },
  { id: "4", title: "Combo Pack", type: "Physical", sold: 54, revenue: 43146 },
  { id: "5", title: "Quick Notes PDF", type: "PDF", sold: 41, revenue: 8159 },
];

const lowStockProducts = [
  { id: "1", title: "Book A", stock: 3 },
  { id: "2", title: "Book B", stock: 5 },
  { id: "3", title: "Combo Pack", stock: 2 },
  { id: "4", title: "Handbook Vol.2", stock: 7 },
  { id: "5", title: "Practice Set", stock: 4 },
];

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
};

const stockColor = (stock: number) => {
  if (stock <= 3) return "text-red-500";
  if (stock <= 6) return "text-yellow-600";
  return "text-green-500";
};

export default function Overview() {
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
          <AdminMenuCard title="Products" count={10} />
          <AdminMenuCard title="Revenue" count={12500} />
          <AdminMenuCard title="Pending Orders" count={5} />
          <AdminMenuCard title="Customers" count={150} />
        </div>

        {/* ROW 1 — Recent Orders + Messages */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recent Orders — desktop table */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-secondary-dark">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs text-secondary-dark underline hover:text-secondary-dark/80 transition-colors font-lato"
              >
                View all →
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl border border-white/7 overflow-hidden">
              <div className="grid grid-cols-5 bg-primary-dark/10 px-5 py-3 text-[11px] font-semibold font-lato text-secondary-dark/70 uppercase tracking-widest">
                <span>Order</span>
                <span>Customer</span>
                <span>Product</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-white/5">
                {recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-5 items-center px-5 py-3.5 hover:bg-white/2 transition-colors"
                  >
                    <span className="text-sm font-medium text-secondary-dark/80">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm text-secondary-dark/60">
                      {order.customer}
                    </span>
                    <span className="text-sm text-secondary-dark/60 truncate pr-2">
                      {order.product}
                    </span>
                    <span className="text-sm font-medium text-secondary-dark/80">
                      ₹{order.amount}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${statusStyles[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-2 md:hidden">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-primary-dark/10 border border-white/[0.07] rounded-2xl px-4 py-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary-dark/80">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs text-secondary-dark/70">
                        {order.customer}
                      </p>
                      <p className="text-xs text-secondary-dark/40">
                        {order.product}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-secondary-dark/80">
                      ₹{order.amount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="w-full md:flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-secondary-dark">
                Messages
              </h2>
              <Link
                href="/admin/messages"
                className="text-xs text-secondary-dark underline hover:text-secondary-dark/80 transition-colors font-lato"
              >
                View all →
              </Link>
            </div>
            <div className="rounded-2xl border border-white/7 overflow-hidden divide-y divide-white/5">
              {recentMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3 hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-secondary-dark/80">
                      {msg.customer}
                    </p>
                    <span className="text-[10px] text-secondary-dark/40">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-dark/50 line-clamp-2">
                    {msg.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2 — Top Selling Products + Low Stock */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Top Selling Products */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-secondary-dark">
                Top Selling Products
              </h2>
              <Link
                href="/admin/products"
                className="text-xs text-secondary-dark underline hover:text-secondary-dark/80 transition-colors font-lato"
              >
                View all →
              </Link>
            </div>
            <div className="rounded-2xl border border-white/7 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-primary-dark/10 px-5 py-3 text-[11px] font-semibold font-lato text-secondary-dark/70 uppercase tracking-widest">
                <span className="col-span-2">Product</span>
                <span>Sold</span>
                <span>Revenue</span>
              </div>
              <div className="divide-y divide-white/5">
                {topSellingProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-4 items-center px-5 py-3.5 hover:bg-white/2 transition-colors"
                  >
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-secondary-dark/80">
                        {product.title}
                      </p>
                      <p className="text-[11px] text-secondary-dark/40">
                        {product.type}
                      </p>
                    </div>
                    <span className="text-sm text-secondary-dark/60">
                      {product.sold} units
                    </span>
                    <span className="text-sm font-medium text-secondary-dark/80">
                      ₹{product.revenue.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="w-full md:flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-secondary-dark">
                Low Stock
              </h2>
              <Link
                href="/admin/products"
                className="text-xs text-secondary-dark underline hover:text-secondary-dark/80 transition-colors font-lato"
              >
                Manage →
              </Link>
            </div>
            <div className="rounded-2xl border border-white/7 overflow-hidden divide-y divide-white/5">
              {lowStockProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors"
                >
                  <p className="text-sm text-secondary-dark/70">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-bold ${stockColor(product.stock)}`}
                    >
                      {product.stock}
                    </span>
                    <span className="text-xs text-secondary-dark/40">left</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
