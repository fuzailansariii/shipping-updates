import { useCheckoutStore } from "@/stores/checkout-store";
import React from "react";

export default function PaymentStep() {
  const { goToPreviousStep } = useCheckoutStore();
  return (
    <div>
      <h1>Payment</h1>
      <button onClick={() => goToPreviousStep()}>Go Back</button>
    </div>
  );
}
