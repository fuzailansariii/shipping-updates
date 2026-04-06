import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";

export const useCheckoutGuard = () => {
  const { items } = useCartStore();
  const {
    selectedAddress,
    createdOrderId,
    setCheckoutStep,
    resetCheckout,
    currentStep,
  } = useCheckoutStore();

  useEffect(() => {
    if (!items || items.length === 0) return;

    const hasPhysicalBooks = items.some((item) => item.type === "book");

    // ✅ CASE 1: No physical books → skip address
    if (!hasPhysicalBooks && currentStep === "address") {
      setCheckoutStep("review");
      return;
    }

    // ✅ CASE 2: Has physical books but no address
    if (hasPhysicalBooks && !selectedAddress) {
      setCheckoutStep("address");
      return;
    }
  }, [items, currentStep, selectedAddress]);
};
