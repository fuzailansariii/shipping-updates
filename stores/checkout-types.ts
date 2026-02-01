import type { Address } from "@/utils/db/schema";
import { CartItem } from "./cart-types";

export const CHECKOUT_STEPS = [
  "address",
  "review",
  "payment",
  "success",
] as const;

export type CheckoutSteps = (typeof CHECKOUT_STEPS)[number];

export interface OrderSummary {
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  totalAmount: number;
}

export interface StepConfig {
  title: string;
  description?: string;
  showProgressBar: boolean;
}

// Step metadata
export const STEP_METADATA: Record<CheckoutSteps, StepConfig> = {
  address: {
    title: "Delivary Address",
    description: "Select where we should deliver your order",
    showProgressBar: true,
  },
  review: {
    title: "Review Order",
    description: "Verify your order details before payment",
    showProgressBar: true,
  },
  payment: {
    title: "Payment",
    description: "Complete your payment",
    showProgressBar: true,
  },
  success: {
    title: "Order Confirmed",
    description: "Your order has been placed successfully",
    showProgressBar: false,
  },
};

export interface OrderCreationResult {
  success: boolean;
  orderId: string;
  orderNumber?: string;
  totalAmount?: number;
  error?: string;
}

// STORE STATE AND ACTIONS
export interface CheckoutState {
  // Use existing DB type for addresses
  selectedAddress: Address | null;
  billingAddress: Address | null;
  useSameAddressForBilling: boolean;
  // Store specific order summary
  orderSummary: OrderSummary;

  // UI State
  currentStep: CheckoutSteps;
  isProcessingOrder: boolean;
  isCalculating: boolean;
  orderError: string | null;

  // Success State
  createdOrderId: string | null;
  createdOrderNumber: string | null;
}

// CHECKOUT ACTIONS

export interface CheckoutActions {
  setSelectedAddress: (address: Address | null) => void;
  setBillingAddress: (address: Address | null) => void;
  toggleSameAddressForBilling: () => void;

  calculateOrderSummary: (cartItems: CartItem[]) => void;

  setCheckoutStep: (step: CheckoutSteps) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  createOrder: (
    userId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    cartItems: CartItem[]
  ) => Promise<OrderCreationResult>;
  resetCheckout: () => void;
  clearError: () => void;
}
