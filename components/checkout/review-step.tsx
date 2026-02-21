"use client";
import React, { useEffect, useState } from "react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import ProductCard from "../product/product-card";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/utils/checkout-helper";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "axios";

export default function ReviewStep() {
  const {
    goToPreviousStep,
    goToNextStep,
    createOrder,
    isProcessingOrder,
    orderError,
    selectedAddress,
    clearError,
  } = useCheckoutStore();

  const { user } = useUser();
  const { items } = useCartStore();

  const [pricing, setPricing] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await axios.post("/api/checkout/preview", {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        });

        const data = response.data;

        if (!data.success) {
          toast.error(data.error || "Failed to load preview");
          goToPreviousStep();
          return;
        }

        setPricing(data.data);

        // Update checkout store's orderSummary
        useCheckoutStore.setState({
          orderSummary: {
            subTotal: data.data.subTotal,
            tax: data.data.tax,
            shippingCharges: data.data.shippingCharges,
            discount: 0,
            totalAmount: data.data.totalAmount,
          },
        });
      } catch (error) {
        console.error("Preview error:", error);
        toast.error("Failed to load checkout preview");
        goToPreviousStep();
      } finally {
        setIsLoadingPreview(false);
      }
    };

    if (items.length > 0) {
      fetchPreview();
    } else {
      setIsLoadingPreview(false);
    }
  }, [items, goToPreviousStep]);

  // Show order error if there is any
  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
      clearError();
    }
  }, [orderError, clearError]);

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place the order");
      return;
    }

    const { selectedAddress } = useCheckoutStore.getState();
    const buyerPhone =
      selectedAddress?.phone || user.phoneNumbers[0]?.phoneNumber || "";

    const result = await createOrder(
      user.id,
      user.emailAddresses[0]?.emailAddress || "",
      user.fullName || "",
      buyerPhone,
      items,
    );

    if (result.success) {
      toast.success("Order created, Proceed to payment!");
      goToNextStep();
    } else {
      toast.error(result.error || "Failed to create order, Please try again!");
    }
  };

  if (isLoadingPreview) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-400 text-sm">Loading preview...</span>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-end items-center mb-4">
          <Button
            variant={"ghost"}
            className="flex items-center gap-2"
            onClick={() => goToPreviousStep()}
          >
            <ArrowLeft />
            <span className="font-semibold font-lato text-secondary-dark">
              Go Back
            </span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Product list - use cart items */}
          <div className="flex flex-col gap-2 w-full">
            {items.map((item) => (
              <ProductCard
                key={item.productId}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                thumbnail={item.thumbnail}
                type={item.type}
              />
            ))}
          </div>

          {/* Pricing summary - use backend-calculated values */}
          <div className="min-w-1/3 flex-1 space-y-4">
            <div className="flex flex-col gap-1 text-base w-full border ring-gray-200 rounded-xl p-2">
              <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
                <span>Subtotal</span>
                {formatPrice(pricing.subTotal)}
              </p>
              <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
                <span>{"Tax(18%)"}</span>
                {formatPrice(pricing.tax)}
              </p>
              <p className="flex justify-between items-center font-lato font-medium text-primary-dark">
                <span>Shipping</span>
                {pricing.shippingCharges === 0
                  ? "Free"
                  : formatPrice(pricing.shippingCharges)}
              </p>
              <Separator className="my-1" />
              <p className="flex justify-between items-center font-lato font-bold text-primary-dark">
                <span>Total</span>
                {formatPrice(pricing.totalAmount)}
              </p>
            </div>

            <Button
              variant={"default"}
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isProcessingOrder || !selectedAddress}
            >
              {isProcessingOrder ? "Placing Order..." : "Proceed to Pay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
