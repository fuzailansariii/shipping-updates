"use client";
import React, { ComponentType, useEffect } from "react";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  CHECKOUT_STEPS,
  CheckoutSteps,
  STEP_METADATA,
} from "@/stores/checkout-types";
import AddressStep from "@/components/checkout/address-step";
import ReviewStep from "@/components/checkout/review-step";
import PaymentStep from "@/components/checkout/payment-step";
import SuccessStep from "@/components/checkout/success-step";
import Container from "@/components/container";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

// Map steps to component
const STEP_COMPONENTS: Record<CheckoutSteps, ComponentType> = {
  address: AddressStep,
  review: ReviewStep,
  payment: PaymentStep,
  success: SuccessStep,
};

export default function Checkout() {
  const { currentStep, resetCheckout } = useCheckoutStore();

  // navigate to the products page if cart is empty and current step is not success
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0 && currentStep !== "success") {
      router.replace("/products");
      return;
    }

    if (items.length > 0 && currentStep === "success") {
      resetCheckout();
    }
  }, [items, currentStep, router]);

  // get current step index and total steps for progress bar
  const currentStepIndex = CHECKOUT_STEPS.indexOf(currentStep);
  const totalSteps = CHECKOUT_STEPS.length - 1; // Exclude success

  // step component and it's metadata
  const StepComponent = STEP_COMPONENTS[currentStep];
  const stepMetadata = STEP_METADATA[currentStep];

  return (
    <Container className="py-6">
      <div className="flex flex-col px-3">
        {/* Progress Bar (only if not success) */}
        {stepMetadata.showProgressBar && (
          <div className="mb-8 font-nunito">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="text-sm font-semibold">
                {stepMetadata.title}
              </span>
            </div>
            {stepMetadata.description && (
              <p className="text-sm text-gray-500 mb-3">
                {stepMetadata.description}
              </p>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Render Current Step Component */}
        <StepComponent />
      </div>
    </Container>
  );
}
