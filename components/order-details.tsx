"use client";
import {
  OrderItems,
  useOrderDetailsStore,
} from "@/stores/orders-history-store";
import { formatPrice } from "@/utils/checkout-helper";
import { AnimatePresence, motion } from "framer-motion";
import { Package, X } from "lucide-react";
import React, { useEffect } from "react";

const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase().trim()) {
    case "pending":
      return {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      };
    case "completed":
      return {
        label: "Completed",
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      };
    case "failed":
      return {
        label: "Failed",
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };
    case "refunded":
      return {
        label: "Refunded",
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
      };
    default:
      return {
        label: status,
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function OrderDetails() {
  const isOpen = useOrderDetailsStore((s) => s.isOpen);
  const selectedOrder = useOrderDetailsStore((s) => s.selectedOrder);
  const closeOrderDetails = useOrderDetailsStore((s) => s.closeOrderDetails);

  const hasPhysicalBook = selectedOrder?.items.some(
    (item) => item.productType === "book",
  );
  const hasDigitalItems = selectedOrder?.items.some(
    (item) => item.productType === "pdf",
  );

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const status = selectedOrder
    ? getStatusConfig(selectedOrder.orderStatus)
    : null;

  if (!selectedOrder) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOrderDetails}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-lg h-[82vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Drag handle — mobile only */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Order Details
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {selectedOrder?.orderNumber ?? "—"}
                </p>
              </div>
              <button
                onClick={closeOrderDetails}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
              {selectedOrder ? (
                <>
                  {/* Status + Date row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status?.bg} ${status?.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status?.dot}`}
                      />
                      {status?.label}
                    </span>
                    <p className="text-xs text-gray-400">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Items
                    </p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item.id ?? index}
                          className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                {item.productTitle}
                              </p>
                              {item.productType === "pdf" ? (
                                <p className="text-xs text-gray-400">
                                  Digital Product
                                </p>
                              ) : (
                                item.quantity && (
                                  <p className="text-xs text-gray-400">
                                    Qty: {item.quantity}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                          {/* Badge - PDF / Book */}
                          <div className="ml-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {item.productType?.toUpperCase() ?? "ITEM"}
                            </span>
                          </div>

                          {item.price && (
                            <p className="text-sm font-semibold text-gray-700 ml-3 shrink-0">
                              {formatPrice(item.price)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-200" />

                  {/* Price Breakdown */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Summary
                    </p>
                    <div className="space-y-2">
                      {selectedOrder.subTotal && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatPrice(selectedOrder.subTotal)}</span>
                        </div>
                      )}

                      {/* Only show shipping if there are physical items */}
                      {hasPhysicalBook && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span>
                            {selectedOrder.shippingCharges === 0
                              ? "Free"
                              : formatPrice(selectedOrder.shippingCharges ?? 0)}
                          </span>
                        </div>
                      )}

                      {/* Show digital delivery if any pdf items */}
                      {hasDigitalItems && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Digital Delivery</span>
                          <span>Free</span>
                        </div>
                      )}

                      {/* Only show tax if there are physical items */}
                      {hasPhysicalBook && selectedOrder.tax && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tax (18%)</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                      )}

                      {selectedOrder.discount !== 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>
                            {formatPrice(selectedOrder.discount ?? 0)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span>{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-200" />

                  {/* Delivery Info - Only show delivery address for physical orders */}
                  {hasPhysicalBook && selectedOrder.shippingAddress && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Delivery Address
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                  )}

                  {/* Payment */}
                  {selectedOrder.paymentMethod && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Payment
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  )}

                  {/* Bottom padding for mobile scroll */}
                  <div className="h-4" />
                </>
              ) : (
                <p className="text-center text-gray-400 text-sm py-10">
                  No order details available.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
