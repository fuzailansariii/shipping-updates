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
      setLoading(false); // auth is done, user just isn't logged in
      setError("Please log in to view your orders.");
      return;
    }
    const controller = new AbortController();
    const fetchOrders = async () => {
      setError(null);
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
          if (err.response?.status === 401) {
            setError("Session expired. Please log in again.");
          } else if (err.response?.status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError("Could not load orders.");
          }
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
    <div className="flex flex-col mx-auto px-4 gap-3 md:px-0">
      <h1 className="text-3xl md:text-5xl text-center font-medium leading-tight">
        Orders & History
      </h1>

      <div className="w-full mt-10 md:mt-5">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 gap-y-5 justify-center">
            {orders.map((order) => {
              const orderStatus = getStatusConfig(order.orderStatus);
              const paymentStatus = getStatusConfig(order.paymentStatus);

              return (
                <div
                  key={order.id}
                  className="relative max-w-md border px-4 py-5 rounded-lg shadow-sm overflow-visible font-roboto text-primary-dark flex flex-col justify-between"
                >
                  {/* Status Badge - fixed positioning */}

                  <span
                    className={`absolute -top-3 right-3 ${orderStatus.badge} rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${orderStatus.dot}`}
                    />
                    {orderStatus.label}
                  </span>
                  {/* Top Info */}
                  <div>
                    <div className="text-xs md:text-sm space-y-1 ">
                      <p>
                        <span className="font-semibold">Order No.</span>{" "}
                        {order.orderNumber.toUpperCase()}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-xs md:text-sm mt-1">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Payment:</span>

                        <span
                          className={`flex items-center gap-1 ${paymentStatus.text}`}
                        >
                          {paymentStatus.label}
                        </span>
                      </p>
                    </div>

                    {/* Product Info */}
                    <div className="mt-2">
                      <p className="text-sm md:text-base font-medium line-clamp-1">
                        {order.items?.[0]?.productTitle ??
                          "Product Unavailable"}
                      </p>

                      {order.items.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{order.items.length - 1} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    <p className="text-sm font-semibold mt-2">
                      Total: {formatPrice(order.totalAmount)}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => openOrderDetails(order)}
                        variant={"ghost"}
                        className="px-2 py-1.5 text-xs flex text-blue-600 underline mt-1 cursor-pointer hover:text-blue-800"
                      >
                        View details
                      </Button>
                      {order.items.some(
                        (item) => item.productType === "pdf",
                      ) && (
                        <div className="ml-2">
                          <Button
                            onClick={() => openDownloadModal(order)}
                            variant={"ghost"}
                            className="px-2 py-1.5 text-xs flex text-blue-600 underline mt-1 cursor-pointer hover:text-blue-800"
                          >
                            Download PDFs
                          </Button>
                        </div>
                      )}
                    </div>
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
