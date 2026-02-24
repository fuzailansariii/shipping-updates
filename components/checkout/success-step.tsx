"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/checkout-helper";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";

export default function SuccessStep() {
  const router = useRouter();
  const { createdOrderId, createdOrderNumber, orderSummary, resetCheckout } =
    useCheckoutStore();
  const { clearCart } = useCartStore();

  // Clear cart and reset checkout on mount
  useEffect(() => {
    clearCart();
  }, []);

  const handleViewOrders = () => {
    resetCheckout();
    router.push("/orders");
  };

  const handleContinueShopping = () => {
    resetCheckout();
    router.push("/products");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 text-sm">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full ring-1 ring-indigo-500/80 bg-primary-dark/10 p-4 rounded-lg space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Order Details</h2>

          {/* Order Number */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold text-indigo-600">
              {createdOrderNumber}
            </span>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Paid</span>
            <span className="font-semibold text-green-600">
              {formatPrice(orderSummary.totalAmount)}
            </span>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Payment Status</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Paid ✓
            </span>
          </div>

          {/* Order Status */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Order Status</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              Confirmed
            </span>
          </div>
        </div>

        {/* What's Next */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-blue-900 text-sm">What's Next?</h3>
          <div className="flex items-start gap-2">
            <Package className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-blue-800 text-xs">
              Your order is being processed. You will receive updates on your
              order status.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleViewOrders} className="w-full bg-primary-dark">
            <ShoppingBag className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
          <Button
            onClick={handleContinueShopping}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
