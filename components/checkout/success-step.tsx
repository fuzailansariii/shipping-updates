import { useCheckoutStore } from "@/stores/checkout-store";
import React from "react";
import { Button } from "../ui/button";

export default function SuccessStep() {
  const { goToPreviousStep } = useCheckoutStore();
  return (
    <div>
      <h1>Checkout</h1>
      <Button onClick={() => goToPreviousStep()}>Go Back</Button>
    </div>
  );
}
