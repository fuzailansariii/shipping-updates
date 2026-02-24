// components/product-actions.tsx

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Check,
  Trash2,
  Edit,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Product } from "@/utils/db/schema";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductActionsProps {
  product: Product;
  cartItem: CartItem | undefined;
  isOutOfStock: boolean;
  isAdmin: boolean;
  canAddMore: boolean;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export function ProductActions({
  product,
  cartItem,
  isOutOfStock,
  isAdmin,
  canAddMore,
  onAddToCart,
  onBuyNow,
  onUpdateQuantity,
  onRemoveFromCart,
}: ProductActionsProps) {
  // Admin user
  if (isAdmin) {
    return (
      <div className="space-y-2">
        <div className="flex justify-center items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 font-medium font-roboto">
            Admin accounts cannot purchase
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full group/btn"
          onClick={() =>
            (window.location.href = `/admin/products/${product.id}/edit`)
          }
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
          Edit Product
        </Button>
      </div>
    );
  }

  // Inactive product
  if (!product.isActive) {
    return (
      <Button disabled className="w-full" variant="secondary">
        <Clock className="w-4 h-4 mr-2" />
        Coming Soon
      </Button>
    );
  }

  // Out of stock
  if (isOutOfStock) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full opacity-60 cursor-not-allowed"
          disabled
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Out of Stock
        </Button>
        <Button
          className="w-full bg-linear-to-r from-blue-600 to-blue-700"
          disabled
        >
          <Zap className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </div>
    );
  }

  // Book in cart (show quantity controls)
  if (cartItem && product.type === "book") {
    return (
      <div className="space-y-2">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-between p-2 rounded-lg border-2 border-blue-200 bg-blue-50"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onUpdateQuantity(cartItem.productId, cartItem.quantity - 1)
            }
            className="h-9 w-9 p-0 hover:bg-blue-100"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="text-center px-3">
            <div className="text-sm font-bold text-gray-900">
              {cartItem.quantity}
            </div>
            <div className="text-xs text-gray-500">in cart</div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={!canAddMore}
            className="h-9 w-9 p-0 hover:bg-blue-100 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </motion.div>

        <Button
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
          onClick={() => onBuyNow(product)}
        >
          <Zap className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </div>
    );
  }

  // PDF in cart (can't change quantity)
  if (cartItem && product.type === "pdf") {
    return (
      <div className="space-y-2">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Button variant="secondary" disabled className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            In Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemoveFromCart(product.id)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>

        <Button
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
          onClick={() => onBuyNow(product)}
        >
          <Zap className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </div>
    );
  }

  // Not in cart (show add to cart buttons)
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full group/btn"
        onClick={() => onAddToCart(product)}
      >
        <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
        Add to Cart
      </Button>

      <Button
        className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
        onClick={() => onBuyNow(product)}
      >
        <Zap className="w-4 h-4 mr-2" />
        Buy Now
      </Button>
    </div>
  );
}
