import { useCheckoutStore } from "@/stores/checkout-store";
import React from "react";

export default function ReviewStep() {
  const { goToPreviousStep } = useCheckoutStore();
  return (
    <div>
      <h1>Review</h1>
      <button onClick={() => goToPreviousStep()}>Go Back</button>
    </div>
  );
}
