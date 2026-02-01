import { useCheckoutStore } from "@/stores/checkout-store";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import ProductCard from "../product-card";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/utils/checkout-helper";

export default function ReviewStep() {
  const { goToPreviousStep, goToNextStep } = useCheckoutStore();
  const { items, shipping, subTotal, tax, total } = useCartStore();
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-5xl">
        {/* title and go back */}
        <div className="flex justify-end items-center mb-4">
          {/* <h1 className="text-xl font-bold text-gray-900">Review</h1> */}
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
          {/* Product list */}
          <div className="flex flex-col gap-2">
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
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-1 text-base w-full border ring-gray-200 rounded-xl p-2">
              <p className="flex justify-between items-center font-lato font-medium  text-primary-dark">
                <span>Subtotal</span>
                {formatPrice(subTotal)}
              </p>
              {/* <p className="flex justify-between items-center font-lato font-medium  text-primary-dark">
                <span>Discount</span>
                {"0"}
              </p> */}
              <p className="flex justify-between items-center font-lato font-medium  text-primary-dark">
                <span>{"Tax(18%)"}</span>
                {formatPrice(tax)}
              </p>
              <p className="flex justify-between items-center font-lato font-medium  text-primary-dark">
                <span>Shipping</span>
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </p>
              <Separator className="my-1" />
              <p className="flex justify-between items-center font-lato font-bold  text-primary-dark">
                <span>Total</span>
                {formatPrice(total)}
              </p>
            </div>

            {/* Proceed to pay */}
            <Button
              variant={"default"}
              className="w-full"
              onClick={() => goToNextStep()}
            >
              Proceed to pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
