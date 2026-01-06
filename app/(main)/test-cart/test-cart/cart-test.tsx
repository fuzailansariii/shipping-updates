"use client";

import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "@/stores/cart-types";

// TODO: Delete this file after testing is complete

export default function CartTest() {
  const {
    items,
    subTotal,
    tax,
    shipping,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  // Mock products for testing
  const mockBook: Omit<CartItem, "quantity"> = {
    productId: "book-1",
    type: "book",
    title: "GP Rating Notes",
    price: 500,
    thumbnail: "https://via.placeholder.com/150",
    maxStock: 10,
  };

  const mockPdf: Omit<CartItem, "quantity"> = {
    productId: "pdf-1",
    type: "pdf",
    title: "Shipping Updates 2024",
    price: 200,
    thumbnail: "https://via.placeholder.com/150",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Cart Store Test</h1>

      {/* Test Buttons */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addToCart(mockBook, 2)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add 2 Books
          </button>
          <button
            onClick={() => addToCart(mockPdf, 1)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add PDF
          </button>
          <button
            onClick={() => addToCart(mockBook, 15)}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Add 15 Books (Test Stock Limit)
          </button>
          <button
            onClick={() => addToCart(mockPdf, 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Add Same PDF Again (Test Error)
          </button>
          <button
            onClick={() => clearCart()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Cart Display */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Cart Items ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.type === "book" ? "Book" : "PDF"} - ₹{item.price}
                    </p>
                    {item.type === "book" && (
                      <p className="text-xs text-gray-500">
                        Stock: {item.maxStock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Controls */}
                  {item.type === "book" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Item Total */}
                  <div className="text-right min-w-20">
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price Summary */}
        {items.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18% GST):</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              {subTotal < 500 && (
                <p className="text-sm text-green-600">
                  Add ₹{(500 - subTotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LocalStorage Data */}
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">📦 localStorage Data:</h3>
        <p className="text-sm text-gray-600">
          Open DevTools → Application → Local Storage → Check "cart-storage"
        </p>
      </div>
    </div>
  );
}
