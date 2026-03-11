import React from "react";

interface LowStockItemProps {
  title: string;
  stock: number;
}

const LOW_STOCK_CRITICAL = 3;
const LOW_STOCK_WARNING = 6;

const getStockColor = (stock: number) => {
  if (stock <= LOW_STOCK_CRITICAL) return "text-red-500";
  if (stock <= LOW_STOCK_WARNING) return "text-yellow-600";
  return "text-green-500";
};

export default function LowStockItem({ stock, title }: LowStockItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
      <p className="text-sm text-secondary-dark/70 line-clamp-1">{title}</p>

      <div className="flex items-center">
        {stock === 0 ? (
          <span className="text-xs font-bold text-red-500">Out of stock</span>
        ) : (
          <>
            <span className={`text-sm font-bold ${getStockColor(stock)} mr-2`}>
              {stock}
            </span>
            <span className="text-xs text-secondary-dark/40">left</span>
          </>
        )}
      </div>
    </div>
  );
}
