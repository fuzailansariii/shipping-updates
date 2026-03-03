"use client";
import React from "react";
import { motion } from "framer-motion";
import StatusBadge, { Status } from "../shared/status-badge";
import { formatPrice } from "@/utils/checkout-helper";
import SectionHeader from "../shared/section-header";
import DataTable from "../shared/data-table";

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
    <>
      <DataTable
        header={
          <SectionHeader
            title="Recent Orders"
            href="/admin/orders"
            hrefLabel="View All"
          />
        }
        columns={[
          { label: "Order" },
          { label: "Customer" },
          { label: "Product" },
          { label: "Amount" },
          { label: "Status" },
        ]}
        data={orders}
        gridClassName="grid-cols-5"
        renderRow={(order) => (
          <>
            <span className="text-sm font-medium text-secondary-dark/80">
              {order.orderNumber}
            </span>
            <span className="text-sm text-secondary-dark/60">
              {order.customer}
            </span>
            <span className="text-sm text-secondary-dark/60 truncate">
              {order.product}
            </span>
            <span className="text-sm font-medium text-secondary-dark/80">
              {formatPrice(order.amount)}
            </span>
            <StatusBadge status={order.status} />
          </>
        )}
        renderMobileCard={(order) => (
          <>
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
          </>
        )}
      />
    </>
  );
}
