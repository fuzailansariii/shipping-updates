"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from "@imagekit/next";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { File, AlertCircle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  type: "book" | "pdf";
  id: string;
  title: string;
  description: string;
  price: number;
  fileSize?: number;
  topics: string[];
  thumbnail: string | null;
  stockQuantity?: number;
  isActive: boolean;
  createdAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Cart functionality
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products");
        setProducts(response.data.products || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleAddToCart = (product: Product) => {
    const result = addToCart(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || "",
        type: product.type,
        maxStock: product.stockQuantity,
      },
      1
    );
    result.success
      ? toast.success(result.message)
      : toast.error(result.message);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);

    router.push("/checkout");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border rounded-lg p-4 animate-pulse bg-white"
              >
                <div className="bg-gray-300 h-40 rounded mb-4" />
                <div className="bg-gray-300 h-6 rounded mb-2" />
                <div className="bg-gray-300 h-4 rounded mb-4" />
                <div className="bg-gray-300 h-10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </Container>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (products.length === 0) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8 text-center">
          <File className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-600 font-semibold">
            No study materials available.
          </p>
        </div>
      </Container>
    );
  }

  /* ---------------- MAIN ---------------- */
  return (
    <Container>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Study Materials</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {products.map((product) => {
            // Get the cart item
            const cartItem = items.find(
              (item) => item.productId === product.id
            );
            return (
              <div
                key={product.id}
                className="border flex flex-col rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
              >
                {/* -------- TOP SECTION -------- */}
                <div>
                  <div className="relative bg-gray-100 h-36">
                    {product.thumbnail ? (
                      <Image
                        urlEndpoint={product.thumbnail}
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <File size={48} />
                      </div>
                    )}

                    <span
                      className={`absolute top-2 left-2 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        product.type === "book"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {product.type === "book" ? "Book" : "PDF"}
                    </span>
                  </div>

                  <div className="p-4 gap-2">
                    <h3 className="font-bold text-base mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {product.topics?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {product.topics.length > 3 && (
                          <span className="text-xs text-gray-500 py-1">
                            +{product.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* -------- BOTTOM SECTION (FIXED) -------- */}
                <div className="p-4 pt-0 mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price.toFixed(2)}
                    </span>

                    {product.fileSize && (
                      <span className="text-sm text-gray-500">
                        {formatFileSize(product.fileSize)}
                      </span>
                    )}
                  </div>

                  {product.isActive ? (
                    <div className="flex flex-col gap-2">
                      {cartItem && product.type === "book" ? (
                        // Quantity controls for books already in cart
                        <motion.div
                          className="flex items-center justify-center gap-3"
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                cartItem.productId,
                                cartItem.quantity - 1
                              )
                            }
                          >
                            <Minus />
                          </Button>

                          <span className="font-medium min-w-7.5 text-center">
                            {cartItem.quantity}
                          </span>

                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <Plus />
                          </Button>
                        </motion.div>
                      ) : cartItem && product.type === "pdf" ? (
                        // PDF already in cart - show message
                        <motion.div
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                          className="flex items-center gap-2 w-full justify-evenly"
                        >
                          <Button variant="secondary" disabled className="">
                            In Cart
                          </Button>
                          <Button
                            variant={"outline"}
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus />
                          </Button>
                        </motion.div>
                      ) : (
                        // Not in cart - show add button
                        <Button
                          onClick={() => handleAddToCart(product)}
                          variant="outline"
                          className="w-full"
                        >
                          Add to Cart
                        </Button>
                      )}

                      <Button
                        className="w-full"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
