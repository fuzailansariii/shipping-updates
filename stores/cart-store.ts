import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartAction, CartItem, CartState } from "./cart-types";
import { toast } from "sonner";

export const useCartStore = create<CartState & CartAction>()(
  persist(
    (set, get) => ({
      // initial state
      items: [],
      subTotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      isOpen: false,

      // Action (function) leave empty for now
      addToCart: (product, quantity) => {
        let result:
          | { success: true; message: string }
          | { success: false; message: string };

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.productId
          );

          // If PDF already exists
          if (existingItem && product.type === "pdf") {
            result = {
              success: false,
              message: "You already have this PDF in your cart",
            };
            return state;
          }

          //   If book exists, update quantity
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.maxStock && newQuantity > product.maxStock) {
              if (
                product.type === "book" &&
                product.maxStock &&
                newQuantity > product.maxStock
              )
                result = {
                  success: false,
                  message: `Only ${product.maxStock} items available in stock. You already have ${existingItem.quantity} in cart.`,
                };
              return state;
            }

            result = {
              success: true,
              message: "Cart updated",
            };

            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }

          // If new item - check stock before adding
          if (
            product.type === "book" &&
            product.maxStock &&
            quantity > product.maxStock
          ) {
            result = {
              success: false,
              message: `Only ${product.maxStock} items available in stock`,
            };
            return state;
          }

          //   Add New Item
          result = {
            success: true,
            message: `${product.title} added to cart`,
          };

          const newItem: CartItem = {
            ...product,
            quantity: product.type === "pdf" ? 1 : quantity,
          };

          return {
            items: [...state.items, newItem],
          };
        });
        get().calculateTotal();
        return result!;
      },

      // Remove the item from cart
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
        get().calculateTotal();
      },

      // Update quantity
      updateQuantity: (productId, quantity) => {
        // if quantity is negative or 0, remove item
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId) {
              // Check max stock for books
              if (
                item.type === "book" &&
                item.maxStock &&
                quantity > item.maxStock
              ) {
                toast.error(`You can add upto ${item.maxStock} items in cart`);
                return item;
              }
              return { ...item, quantity };
            }
            return item;
          }),
        }));
        get().calculateTotal();
      },
      // Clear cart
      clearCart: () => {
        set({
          items: [],
          subTotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
        });
      },

      calculateTotal: () => {
        set((state) => {
          // Sub total of a product
          const subTotal = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          //   Tax calculation
          const tax = subTotal * 0.18;

          // Shipping (₹50 flat, free above ₹500)
          const shipping = subTotal >= 500 ? 0 : 50;

          //   Total
          const total = subTotal + tax + shipping;

          //   Return
          return {
            subTotal,
            tax,
            shipping,
            total,
          };
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "cart-storage", // localStorage key name
    }
  )
);
