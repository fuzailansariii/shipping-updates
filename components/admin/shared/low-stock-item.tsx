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
      {/* Title Wrapper MUST allow shrinking */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-secondary-dark/70 truncate">{title}</p>
      </div>

      <div className="flex items-center gap-1.5 ml-3 shrink-0">
        {stock === 0 ? (
          <span className="text-xs font-bold text-red-500">Out of stock</span>
        ) : (
          <>
            <span className={`text-sm font-bold ${getStockColor(stock)}`}>
              {stock}
            </span>
            <span className="text-xs text-secondary-dark/40">left</span>
          </>
        )}
      </div>
    </div>
  );
}
