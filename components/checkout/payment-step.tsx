"use client";
import React, { useEffect, useState } from "react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { formatPrice } from "@/utils/checkout-helper";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentStep() {
  const {
    createdOrderId,
    createdOrderNumber,
    orderSummary,
    goToNextStep,
    goToPreviousStep,
  } = useCheckoutStore();
  const { clearCart } = useCartStore();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedAddress } = useCheckoutStore();

  useEffect(() => {
    if (!createdOrderId) {
      goToPreviousStep();
    }
  }, [createdOrderId]);

  const handlePayment = async () => {
    if (!createdOrderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Failed to load payment gateway. Check your internet connection.",
        );
      }

      // Step 1: Create Razorpay order
      const createRes = await axios.post("/api/payment/create-order", {
        orderId: createdOrderId,
      });

      if (!createRes.data.success) {
        throw new Error(createRes.data.error || "Failed to initiate payment");
      }

      const { razorpayOrderId, amount, currency } = createRes.data.data;

      // Step 2: Open Razorpay checkout
      // add null check before opening Razorpay
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        toast.error("Payment configuration error. Please contact support.");
        setIsProcessing(false);
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Shipping Updates",
        description: `Order #${createdOrderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.fullName || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
        },
        theme: { color: "#4F46E5" },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on server
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: createdOrderId,
            });

            if (!verifyRes.data.success) {
              throw new Error(
                verifyRes.data.error || "Payment verification failed",
              );
            }

            clearCart();
            toast.success("Payment successful! 🎉");
            goToNextStep();
          } catch (err: any) {
            toast.error(
              err.message || "Payment verification failed. Contact support.",
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // Handle payment failure from Razorpay UI
      razorpay.on("payment.failed", async (response: any) => {
        setIsProcessing(false);
        await axios.post("/api/payment/failed", {
          orderId: createdOrderId,
        });
        toast.error(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Payment failed. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
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

        <div className="w-full ring-1 ring-indigo-500/80 bg-primary-dark/10 p-4 rounded-lg space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold">{createdOrderNumber}</span>
          </div>
          <Separator />
          {selectedAddress && (
            <div className="w-full ring-1 ring-gray-300 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {selectedAddress.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedAddress.addressLine1}, {selectedAddress.city}
              </p>
              <p className="text-sm text-gray-600">
                {selectedAddress.state} - {selectedAddress.pincode}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {selectedAddress.phone}
              </p>
            </div>
          )}
          <Separator />
          <div className="space-y-2">
            <p className="flex justify-between font-lato font-medium text-primary-dark">
              <span>Subtotal</span>
              <span>{formatPrice(orderSummary.subTotal)}</span>
            </p>
            <p className="flex justify-between font-lato font-medium text-primary-dark">
              <span>Tax (18%)</span>
              <span>{formatPrice(orderSummary.tax)}</span>
            </p>
            <p className="flex justify-between font-lato font-medium text-primary-dark">
              <span>Shipping</span>
              <span>
                {orderSummary.shippingCharges === 0
                  ? "Free"
                  : formatPrice(orderSummary.shippingCharges)}
              </span>
            </p>
            <Separator />
            <p className="flex justify-between font-lato font-bold text-primary-dark text-lg">
              <span>Total</span>
              <span>{formatPrice(orderSummary.totalAmount)}</span>
            </p>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            <span>Pay {formatPrice(orderSummary.totalAmount)}</span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-500 text-center">
            Secured by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
