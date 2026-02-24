interface ProductStockBadgeProps {
  isActive: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  stockQuantity?: number;
}

export function ProductStockBadge({
  isActive,
  isOutOfStock,
  isLowStock,
  stockQuantity,
}: ProductStockBadgeProps) {
  // product is not active
  if (!isActive) {
    return (
      <div className="absolute top-3 right-3">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-500/90 text-white backdrop-blur-sm">
          Coming Soon
        </span>
      </div>
    );
  }

  // out of stock
  if (isOutOfStock) {
    return (
      <div className="absolute top-3 right-3">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/90 text-white backdrop-blur-sm">
          Out of Stock
        </span>
      </div>
    );
  }

  // Low stock ( 1-5 items left)
  if (isLowStock) {
    return (
      <div className="absolute top-3 right-3">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/90 text-white backdrop-blur-sm">
          Low Stock
        </span>
      </div>
    );
  }

  // In stock, no badge needed
  return null;
}
