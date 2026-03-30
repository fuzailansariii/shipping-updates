"use client";
import DataTable from "@/components/admin/shared/data-table";
import { motion } from "framer-motion";
import SectionHeader from "@/components/admin/shared/section-header";
import { formatDate } from "@/utils/pdf-helper";
import { formatPrice } from "@/utils/checkout-helper";
import { useRouter } from "next/navigation";
import { useAdminOrderModal } from "@/stores/admin-order-modal-store";
import { OrderWithItems } from "@/types";
import StatusBadge from "../shared/status-badge";
import { OrderStatus } from "@/utils/status-badge";

type Pagination = {
  currentPage: number;
  total: number;
  totalPages: number;
};

interface OrdersClientProps {
  orders: OrderWithItems[];
  pagination: Pagination;
}

export default function OrdersClient({
  orders,
  pagination,
}: OrdersClientProps) {
  const router = useRouter();
  const { openModal } = useAdminOrderModal();

  //   Pagination
  const hasNextPage = pagination.currentPage < pagination.totalPages;
  const hasPrevPage = pagination.currentPage > 1;

  // All Pending Orders
  const pendingOrders = orders.filter((o) => o.orderStatus === "pending");
  // All Remainig Orders
  const otherOrders = orders.filter((o) => o.orderStatus !== "pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5"
    >
      <h1 className="font-semibold font-lato text-lg">Orders</h1>

      {/* Table — only renders when not loading */}

      {/* Pending Orders */}
      <DataTable
        header={
          <SectionHeader title={`Pending Orders (${pendingOrders.length})`} />
        }
        columns={[
          { label: "Order Number" },
          { label: "Buyer Name" },
          { label: "Items" },
          { label: "Total Amount" },
          { label: "Payment Method" },
          { label: "Payment Status" },
          { label: "Order Status" },
          { label: "Ordered" },
        ]}
        data={pendingOrders}
        onRowClick={(order) => openModal(order)}
        gridClassName="grid-cols-8"
        renderRow={(pendingOrders) => (
          <>
            <span className="text-sm truncate">
              {pendingOrders.orderNumber}
            </span>
            <span className="text-sm truncate">{pendingOrders.buyerName}</span>
            <span className="text-sm truncate">
              {pendingOrders.items.length} item(s)
            </span>
            <span className="text-sm truncate">
              {formatPrice(pendingOrders.totalAmount)}
            </span>
            <span className="text-sm truncate capitalize">
              {pendingOrders.paymentMethod}
            </span>
            <div className="flex justify-center">
              <StatusBadge
                status={pendingOrders.paymentStatus as OrderStatus}
              />
            </div>
            <div className="flex justify-center">
              <StatusBadge status={pendingOrders.orderStatus as OrderStatus} />
            </div>
            <span className="text-sm truncate">
              {formatDate(pendingOrders.createdAt)}
            </span>
          </>
        )}
        renderMobileCard={(pendingOrders) => (
          <>
            <div className="flex items-center justify-between font-nunito">
              <span className="text-sm font-semibold text-secondary-dark/80">
                {pendingOrders.orderNumber}
              </span>
              <span className="text-xs text-secondary-dark/40">
                Order Status ·{" "}
                <StatusBadge
                  status={pendingOrders.orderStatus as OrderStatus}
                />
              </span>
            </div>
            <div className="flex items-center justify-between font-nunito">
              <div className="space-y-0.5">
                <p className="text-xs text-secondary-dark/70">
                  {pendingOrders.buyerName}
                </p>
                <p className="text-xs text-secondary-dark/40">
                  {pendingOrders.items.length} item(s) ·{" "}
                  <span className="capitalize">
                    {pendingOrders.paymentMethod}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-semibold text-secondary-dark/80">
                  {formatPrice(pendingOrders.totalAmount)}
                </span>
                <span className="text-xs text-secondary-dark/40 font-nunito">
                  Payment ·{" "}
                  <StatusBadge
                    status={pendingOrders.paymentStatus as OrderStatus}
                  />
                </span>
              </div>
            </div>
            <p className="text-xs text-secondary-dark/40">
              {formatDate(pendingOrders.createdAt)}
            </p>
          </>
        )}
      />

      {/* Other Orders */}
      <DataTable
        header={
          <SectionHeader title={`Other Orders (${otherOrders.length})`} />
        }
        columns={[
          { label: "Order Number" },
          { label: "Buyer Name" },
          { label: "Items" },
          { label: "Total Amount" },
          { label: "Payment Method" },
          { label: "Payment Status" },
          { label: "Order Status" },
          { label: "Ordered" },
        ]}
        data={otherOrders}
        gridClassName="grid-cols-8"
        onRowClick={(order) => openModal(order)}
        renderRow={(otherOrders) => (
          <>
            <span className="text-sm truncate">{otherOrders.orderNumber}</span>
            <span className="text-sm truncate">{otherOrders.buyerName}</span>
            <span className="text-sm truncate">
              {otherOrders.items.length} item(s)
            </span>
            <span className="text-sm truncate">
              {formatPrice(otherOrders.totalAmount)}
            </span>
            <span className="text-sm truncate capitalize">
              {otherOrders.paymentMethod}
            </span>
            <div className="flex justify-center">
              <StatusBadge status={otherOrders.paymentStatus as OrderStatus} />
            </div>
            <div className="flex justify-center">
              <StatusBadge status={otherOrders.orderStatus as OrderStatus} />
            </div>
            <span className="text-sm truncate">
              {formatDate(otherOrders.createdAt)}
            </span>
          </>
        )}
        renderMobileCard={(otherOrders) => (
          <>
            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary-dark">
                  {otherOrders.orderNumber}
                </p>
                <p className="text-xs text-secondary-dark/50">
                  {formatDate(otherOrders.createdAt)}
                </p>
              </div>

              {/* Order Status Badge */}
              <StatusBadge status={otherOrders.orderStatus as OrderStatus} />
            </div>

            {/* Middle Row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-dark/80 font-medium">
                  {otherOrders.buyerName}
                </p>
                <p className="text-xs text-secondary-dark/50">
                  {otherOrders.items.length} item(s) ·{" "}
                  <span className="capitalize">
                    {otherOrders.paymentMethod}
                  </span>
                </p>
              </div>

              <p className="text-base font-semibold text-secondary-dark">
                {formatPrice(otherOrders.totalAmount)}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-400/50">
              <p className="text-xs text-secondary-dark/50">Payment Status</p>

              <StatusBadge status={otherOrders.paymentStatus as OrderStatus} />
            </div>
          </>
        )}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-secondary-dark/50">
            Showing {(pagination.currentPage - 1) * 20 + 1}–
            {Math.min(pagination.currentPage * 20, pagination.total)} of{" "}
            {pagination.total} orders
          </p>
          <div className="flex gap-2 items-center">
            <button
              disabled={!hasPrevPage}
              onClick={() =>
                router.push(`/admin/orders?page=${pagination.currentPage - 1}`)
              }
              className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs text-secondary-dark/60">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={!hasNextPage}
              onClick={() =>
                router.push(`/admin/orders?page=${pagination.currentPage + 1}`)
              }
              className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
