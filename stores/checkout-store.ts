import axios from "axios";
import {
  CheckoutActions,
  CheckoutState,
  CheckoutSteps,
} from "./checkout-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialState: CheckoutState = {
  selectedAddress: null,
  billingAddress: null,
  useSameAddressForBilling: true,

  orderSummary: {
    subTotal: 0,
    tax: 0,
    discount: 0,
    shippingCharges: 0,
    totalAmount: 0,
  },

  currentStep: "address",
  isProcessingOrder: false,
  isCalculating: false,
  orderError: null,

  createdOrderId: null,
  createdOrderNumber: null,
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set, get) => ({
      // initial States
      ...initialState,

      setSelectedAddress: (address) => {
        set({ selectedAddress: address });
      },

      setBillingAddress: (address) => {
        set({ billingAddress: address });
      },

      toggleSameAddressForBilling: () => {
        set((state) => ({
          useSameAddressForBilling: !state.useSameAddressForBilling,
        }));
      },

      //   Order summary
      calculateOrderSummary: (cartItem) => {
        set({ isCalculating: true });

        // Check if there is physical books
        const hasPhysicalBooks = cartItem.some((item) => item.type === "book");

        // sub total of items in cart
        const subTotal = cartItem.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        // tax amount on the books only
        const taxableAmount = cartItem
          .filter((item) => item.type === "book")
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = taxableAmount * 0.18;

        // shipping charge on books only if the total item cost < Rs.500
        let shippingCharges = 0;
        if (hasPhysicalBooks) {
          shippingCharges = subTotal >= 500 ? 0 : 50;
        }

        // total amount
        const totalAmount = subTotal + tax + shippingCharges;

        set({
          orderSummary: {
            subTotal: parseFloat(subTotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shippingCharges: parseFloat(shippingCharges.toFixed(2)),
            discount: 0,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
          },
          isCalculating: false,
        });
      },

      //   checkout steps
      setCheckoutStep: (step) => {
        set({ currentStep: step });
      },

      //   Go to next step
      goToNextStep: () => {
        const { currentStep } = get();
        const steps: CheckoutSteps[] = [
          "address",
          "review",
          "payment",
          "success",
        ];
        const currentIndex = steps.indexOf(currentStep);

        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1] });
        }
      },

      //   Go to previous step
      goToPreviousStep: () => {
        const { currentStep } = get();
        const steps: CheckoutSteps[] = [
          "address",
          "review",
          "payment",
          "success",
        ];

        const currentIndex = steps.indexOf(currentStep);

        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1] });
        }
      },

      //   order creation on the DB.
      createOrder: async (
        userId,
        userEmail,
        userName,
        userPhone,
        cartItems,
      ) => {
        set({ isProcessingOrder: true, orderError: null });
        const state = get();
        try {
          const hasBooks = cartItems.some((item) => item.type === "book");
          if (hasBooks && !state.selectedAddress) {
            throw new Error("Please select a shipping address");
          }

          // prepare order Items
          const orderItems = cartItems.map((item) => ({
            productId: item.productId,
            productType: item.type,
            productTitle: item.title,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          }));

          // Format address
          const formatAddress = (address: any) => {
            if (!address) return "Digital Product - No Address Required";

            const parts = [
              address.fullName,
              address.phone,
              address.addressLine1,
              address.addressLine2,
              address.landmark,
              address.city,
              address.state,
              address.pincode,
            ].filter(Boolean);
            return parts.join(", ");
          };
          const shippingAddress = formatAddress(state.selectedAddress);
          const billingAddress = state.useSameAddressForBilling
            ? shippingAddress
            : formatAddress(state.billingAddress);

          const response = await axios.post("/api/checkout", {
            buyerEmail: userEmail,
            buyerName: userName,
            buyerPhone: userPhone,
            shippingAddress,
            billingAddress,
            subTotal: state.orderSummary.subTotal,
            tax: state.orderSummary.tax,
            totalAmount: state.orderSummary.totalAmount,
            shippingCharges: state.orderSummary.shippingCharges,
            discount: state.orderSummary.discount,
            items: orderItems,
            paymentMethod: "razorpay",
            paymentStatus: "pending",
          });

          if (response.status !== 201) {
            throw new Error(response.data.error || "Failed to create order");
          }

          console.log("Placing order status: ", response.data);

          set({
            isProcessingOrder: false,
            createdOrderId: response.data.data.orderId,
            createdOrderNumber: response.data.data.orderNumber,
            currentStep: "success",
          });
          return {
            success: true,
            orderId: response.data.data.orderId,
            createdOrderId: response.data.data.orderId,
            createdOrderNumber: response.data.data.orderNumber,
            totalAmount: response.data.totalAmount,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occured during checkout";

          set({
            isProcessingOrder: false,
            orderError: errorMessage,
          });

          return {
            success: false,
            orderId: "",
            error: errorMessage,
          };
        }
      },

      resetCheckout: () => {
        set(initialState);
      },

      clearError: () => {
        set({ orderError: null });
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
