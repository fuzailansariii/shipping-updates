"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatPrice } from "@/utils/checkout-helper";
import { Button } from "../ui/button";
import { useOrderDetailsStore } from "@/stores/orders-history-store";

type OrderItem = {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  productType: "pdf" | "book";
};

type Order = {
  id: string;
  orderStatus: string;
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

  const { openOrderDetails } = useOrderDetailsStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          withCredentials: true,
        });
        const ordersArray = response.data?.data?.orders ?? [];
        console.log("Order Array: ", ordersArray);
        setOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase().trim()) {
      case "pending":
        return { label: "Pending", color: "bg-yellow-500 text-white" };
      case "confirmed":
        return { label: "Confirmed", color: "bg-green-600 text-white" };
      case "completed":
        return { label: "Completed", color: "bg-green-600 text-white" };
      case "failed":
        return { label: "Failed", color: "bg-red-600 text-white" };
      case "cancelled":
        return { label: "Cancelled", color: "bg-gray-600 text-white" };
      case "refunded":
        return { label: "Refunded", color: "bg-blue-600 text-white" };
      default:
        return { label: status, color: "bg-gray-500 text-white" };
    }
  };

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
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders found. Start shopping to see your orders here.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 gap-y-5 justify-center">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="relative max-w-md border px-4 py-5 rounded-lg shadow-sm overflow-visible"
                >
                  {/* Status Badge - fixed positioning */}
                  <span
                    className={`absolute -top-3 right-3 ${statusConfig.color} rounded-full px-3 py-1 text-xs md:text-sm text-white font-semibold`}
                  >
                    {statusConfig.label}
                  </span>

                  {/* Top Info */}
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <p>
                      <span className="font-semibold">Order No.</span>{" "}
                      {order.orderNumber.toUpperCase()}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Product Info */}
                  <div className="mt-2">
                    <p className="text-sm md:text-base font-medium line-clamp-1">
                      {order.items?.[0]?.productTitle ?? "Product Unavailable"}
                    </p>

                    {order.items.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        +{order.items.length - 1} more item(s)
                      </p>
                    )}

                    <p className="text-sm font-semibold mt-2">
                      Total: {formatPrice(order.totalAmount)}
                    </p>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={() => openOrderDetails(order)}
                    variant={"ghost"}
                    className="px-2 py-1.5 text-xs flex text-blue-600 underline mt-1 cursor-pointer hover:text-blue-800"
                  >
                    View details
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
