"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/checkout-helper";
import { Button } from "../ui/button";
import { useOrderDetailsStore } from "@/stores/orders-history-store";
import { formatDate } from "@/utils/pdf-helper";
import { getStatusConfig } from "@/utils/status-badge";
import { useAuth } from "@clerk/nextjs";

type OrderItem = {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  productType: "pdf" | "book";
  downloadCount: number;
  maxDownloads: number;
};

type Order = {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

// --------------------
// Skeleton
// --------------------
function OrderSkeleton() {
  return (
    <div className="border px-4 pt-8 pb-5 rounded-lg shadow-sm animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-48 mt-3" />
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  );
}

export default function OrderCard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { openOrderDetails, openDownloadModal } = useOrderDetailsStore();

  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setLoading(false);
      setError("Please log in to view your orders.");
      return;
    }

    setLoading(true);
    setOrders([]);
    setError(null);

    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          withCredentials: true,
          signal: controller.signal,
        });
        const ordersArray = response.data?.data?.orders ?? [];
        setOrders(ordersArray);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401)
            setError("Session expired. Please log in again.");
          else if (err.response?.status === 500)
            setError("Server error. Please try again later.");
          else setError("Could not load orders.");
        }
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [userId, isLoaded]);

  return (
    <div className="flex flex-col mx-auto gap-3 w-full">
      <h1 className="text-3xl md:text-4xl text-center font-medium leading-tight">
        Orders & History
      </h1>

      <div className="w-full mt-4 md:mt-5">
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders found. Start shopping to see your orders here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full px-3">
            {orders.map((order) => {
              const orderStatus = getStatusConfig(order.orderStatus);
              const paymentStatus = getStatusConfig(order.paymentStatus);

              return (
                <div
                  key={order.id}
                  className="relative flex flex-col gap-2.5 bg-secondary-dark/10 border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-colors duration-150 font-sans"
                >
                  {/* Top row: order number + status badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-gray-400 tracking-wide uppercase">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full whitespace-nowrap ${orderStatus.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${orderStatus.dot}`}
                      />
                      {orderStatus.label}
                    </span>
                  </div>

                  {/* Product title */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {order.items?.[0]?.productTitle ?? "Product Unavailable"}
                    </p>
                    {order.items.length > 1 && (
                      <p className="text-xs text-gray-400 mt-1">
                        +{order.items.length - 1} more item
                        {order.items.length > 2 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Date</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Payment</span>
                      <span className={`font-medium ${paymentStatus.text}`}>
                        {paymentStatus.label}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Price */}
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => openOrderDetails(order)}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-3"
                    >
                      View details
                    </Button>
                    {order.items.some((item) => item.productType === "pdf") && (
                      <Button
                        onClick={() => openDownloadModal(order)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Download PDFs
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
