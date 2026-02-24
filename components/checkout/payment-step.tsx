"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { formatPrice } from "@/utils/checkout-helper";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function PaymentStep() {
  const {
    createdOrderId,
    createdOrderNumber,
    orderSummary,
    goToNextStep,
    goToPreviousStep,
  } = useCheckoutStore();

  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!createdOrderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Simulate payment
      const paymentResponse = await axios.post("/api/payment/simulate", {
        orderId: createdOrderId,
        amount: orderSummary.totalAmount,
      });

      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.error || "Payment failed");
      }

      const { paymentId } = paymentResponse.data.data;

      // Step 3: Clear cart and go to success
      clearCart();
      toast.success("Payment successful! 🎉");
      goToNextStep();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Payment failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Go Back */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={goToPreviousStep}
            disabled={isProcessing}
          >
            <ArrowLeft />
            <span className="font-semibold font-lato text-secondary-dark">
              Go Back
            </span>
          </Button>
        </div>

        {/* Order Summary Card */}
        <div className="w-full ring-1 ring-indigo-500/80 bg-primary-dark/10 p-4 rounded-lg space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          {/* Order Number */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold">{createdOrderNumber}</span>
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
              <span>Subtotal</span>
              <span>{formatPrice(orderSummary.subTotal)}</span>
            </p>
            <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
              <span>Tax (18%)</span>
              <span>{formatPrice(orderSummary.tax)}</span>
            </p>
            <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
              <span>Shipping</span>
              <span>
                {orderSummary.shippingCharges === 0
                  ? "Free"
                  : formatPrice(orderSummary.shippingCharges)}
              </span>
            </p>
            <Separator />
            <p className="flex justify-between items-center font-lato font-bold text-primary-dark text-lg">
              <span>Total</span>
              <span>{formatPrice(orderSummary.totalAmount)}</span>
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a simulated payment. No real
            money will be charged. Payment gateway (Razorpay) will be integrated
            soon.
          </p>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Pay {formatPrice(orderSummary.totalAmount)}
            </span>
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-500 text-center">
            Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
