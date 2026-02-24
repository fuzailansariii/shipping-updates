"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from "@imagekit/next";
import Container from "@/components/container";
import {
  File,
  BookOpen,
  FileText,
  AlertCircle,
  RefreshCw,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useProductModalStore } from "@/stores/product-store";
import { formatFileSize } from "@/utils/pdf-helper";
import { Product } from "@/utils/db/schema";
import { ProductStockBadge } from "@/components/product/product-stock-badge";
import { ProductActions } from "@/components/product/product-actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/checkout-helper";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAdmin } = useUserRole();
  const router = useRouter();
  const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
  const { openProductModal } = useProductModalStore();

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

  const handleAddToCart = (product: Product) => {
    if (isAdmin) {
      toast.error("Admin Cannot Add Products To Cart");
      return;
    }

    // Check stock for books
    if (product.type === "book") {
      if (!product.stockQuantity || product.stockQuantity <= 0) {
        toast.error("This product is out of stock");
        return;
      }

      const cartItem = items.find((item) => item.productId === product.id);
      const currentQtyInCart = cartItem?.quantity || 0;

      if (currentQtyInCart >= product.stockQuantity) {
        toast.error(`Only ${product.stockQuantity} items available`);
        return;
      }
    }

    const result = addToCart(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || "",
        type: product.type,
        maxStock: product.stockQuantity,
      },
      1,
    );

    result.success
      ? toast.success(result.message)
      : toast.error(result.message);
  };

  const handleBuyNow = (product: Product) => {
    if (isAdmin) {
      toast.error("Admins cannot purchase products");
      return;
    }

    // check stock for books
    if (
      product.type === "book" &&
      (!product.stockQuantity || product.stockQuantity <= 0)
    ) {
      toast.error("This product is out of stock");
      return;
    }

    const cartItem = items.find((item) => item.productId === product.id);
    if (!cartItem) {
      const result = addToCart(
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || "",
          type: product.type,
          maxStock: product.stockQuantity,
        },
        1,
      );
      if (!result.success) {
        toast.error(result.message);
        return;
      }
    }
    router.push("/checkout");
  };

  //  Helper function to compute product state
  const getProductState = (product: Product) => {
    const cartItem = items.find((item) => item.productId === product.id);
    const isOutOfStock =
      product.type === "book" &&
      (!product.stockQuantity || product.stockQuantity <= 0);
    const isLowStock =
      product.type === "book" &&
      product.stockQuantity > 0 &&
      product.stockQuantity <= 5;
    const canAddMore =
      product.type === "book"
        ? (cartItem?.quantity || 0) < (product.stockQuantity || 0)
        : !cartItem;

    return {
      cartItem,
      isOutOfStock,
      isLowStock,
      canAddMore,
    };
  };

  // Loading, error, empty states.
  if (loading) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded-lg w-96" />
          </div>

          {/* Product Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="aspect-6/4 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse" />

                {/* Content skeleton */}
                <div className="p-5 space-y-3">
                  {/* Badge skeleton */}
                  <div className="h-3 bg-gray-200 rounded-full w-20 animate-pulse" />

                  {/* Title skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                  </div>

                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                  </div>

                  {/* Topics skeleton */}
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-100 rounded-md w-16 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-20 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-12 animate-pulse" />
                  </div>

                  {/* Price & button skeleton */}
                  <div className="pt-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded-lg w-24 animate-pulse" />
                    <div className="h-7 bg-gray-200 rounded-lg w-full animate-pulse" />
                    <div className="h-7 bg-gray-200 rounded-lg w-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon with animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative inline-flex mb-6"
            >
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
              <div className="relative bg-linear-to-br from-red-50 to-red-100 p-6 rounded-full">
                <AlertCircle
                  className="text-red-500"
                  size={64}
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>

            {/* Help text */}
            <p className="text-sm text-gray-500 mt-6">
              If the problem persists, please{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                contact support
              </a>
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {/* Empty Icon with animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-flex mb-6"
            >
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-30" />
              <div className="relative bg-linear-to-br from-blue-50 to-indigo-50 p-8 rounded-full">
                <BookOpen
                  className="text-blue-500"
                  size={72}
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>

            {/* Empty Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Study Materials Yet
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're working hard to bring you the best shipping exam preparation
              materials. Check back soon for updates!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Want to be notified when we add new materials?
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => (window.location.href = "/contact")}
                className="inline-flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Get Notified
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Study Materials</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const state = getProductState(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.1 }}
                className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* IMAGE SECTION */}
                <div
                  onClick={() => openProductModal(product)}
                  className="relative aspect-6/4 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
                >
                  {product.thumbnail ? (
                    <>
                      <Image
                        urlEndpoint={product.thumbnail}
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        priority
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <File
                        size={56}
                        className="text-gray-300"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        product.type === "book"
                          ? "bg-purple-500/90 text-white"
                          : "bg-blue-500/90 text-white"
                      }`}
                    >
                      {product.type === "book" ? (
                        <>
                          <BookOpen size={14} />
                          Book
                        </>
                      ) : (
                        <>
                          <FileText size={14} />
                          PDF
                        </>
                      )}
                    </span>
                  </div>

                  {/*  Stock Badge - using component */}
                  <ProductStockBadge
                    isActive={product.isActive}
                    isOutOfStock={state.isOutOfStock}
                    isLowStock={state.isLowStock}
                    stockQuantity={product.stockQuantity}
                  />
                </div>

                {/* CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-5">
                  <h2 className="font-bold text-lg mb-1 font-lato text-gray-900 line-clamp-2">
                    <span
                      onClick={() => openProductModal(product)}
                      className="inline cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {product.title}
                    </span>
                  </h2>

                  <p className="text-gray-600 text-sm font-roboto mb-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {product.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 font-nunito">
                      {product.topics.slice(0, 3).map((topic, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                      {product.topics.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs text-gray-500 font-medium">
                          +{product.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex-1" />

                  {/* PRICE & FILE SIZE */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatPrice(product.price)}
                      </div>
                      {product.type === "book" && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {state.isOutOfStock ? "Out of Stock" : "In Stock"}
                        </div>
                      )}
                    </div>

                    {product.fileSize && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">File Size</div>
                        <div className="text-sm font-medium text-gray-700">
                          {formatFileSize(product.fileSize)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/*  ACTIONS - using component */}
                  <ProductActions
                    product={product}
                    cartItem={state.cartItem}
                    isOutOfStock={state.isOutOfStock}
                    isAdmin={isAdmin}
                    canAddMore={state.canAddMore}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromCart={removeFromCart}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
