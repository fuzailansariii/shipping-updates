"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store"; // Fixed import path

// TODO: Add navigation to checkout page
// TODO: Fix UI Later

export default function CartSidebar() {
  const { isOpen, closeCart, items, subTotal, tax, shipping, total } =
    useCartStore(); // Added price values

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-60 flex flex-col"
            // Changed z-50 to z-[60]
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-neutral-500 text-lg mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-neutral-400 text-sm">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 p-3 border border-neutral-200 rounded-lg"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-neutral-600 text-sm">
                          ₹{item.price} × {item.quantity}
                        </p>
                        <p className="font-semibold text-blue-600">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Price Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal:</span>
                    <span className="font-semibold">
                      ₹{subTotal.toFixed(2)}
                      {/* Simplified */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (18%):</span>
                    <span className="font-semibold">
                      ₹{tax.toFixed(2)}
                      {/* Simplified */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping:</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                      {/* Simplified */}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                    {/* Simplified */}
                  </div>
                </div>

                <button
                  onClick={() => {
                    // TODO: Navigate to checkout
                    closeCart();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={closeCart}
                  className="w-full border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
