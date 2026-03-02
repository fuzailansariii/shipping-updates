"use client";
import React from "react";
import { motion } from "framer-motion";
import StatusBadge, { Status } from "../shared/status-badge";
import { formatPrice } from "@/utils/checkout-helper";
import SectionHeader from "../shared/section-header";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: Status;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="w-full md:w-2/3">
      <SectionHeader
        title="Recent Orders"
        href="/admin/orders"
        hrefLabel="View All"
      />

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
          {orders.map((order, i) => (
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
                {formatPrice(order.amount)}
              </span>
              <StatusBadge status={order.status} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-2 md:hidden">
        {orders.map((order, i) => (
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
              <StatusBadge status={order.status} />
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
                {formatPrice(order.amount)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
