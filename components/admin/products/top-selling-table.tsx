import React from "react";
import SectionHeader from "../shared/section-header";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/checkout-helper";

interface TopSellingProduct {
  id: string;
  title: string;
  type: "book" | "pdf";
  sold: number;
  revenue: number;
}

interface TopSellingTableProps {
  products: TopSellingProduct[];
}

export default function TopSellingProducts({ products }: TopSellingTableProps) {
  return (
    <div className="w-full md:w-2/3">
      <SectionHeader
        title="Top Selling Products"
        href="/admin/products"
        hrefLabel="View all"
      />
      <div className="rounded-2xl border border-white/7 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 bg-primary-dark/10 px-5 py-3 text-[11px] font-semibold font-lato text-secondary-dark/70 uppercase tracking-widest">
          <span className="col-span-2">Product</span>
          <span>Sold</span>
          <span>Revenue</span>
        </div>
        {products.length === 0 && (
          <p className="p-4 text-sm text-secondary-dark/50">No sales yet.</p>
        )}
        <div className="divide-y divide-white/5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-4 items-center px-5 py-3.5 hover:bg-white/2 transition-colors"
            >
              <div className="col-span-2">
                <p className="text-sm font-medium text-secondary-dark/80">
                  {product.title}
                </p>
                <p className="text-[11px] text-secondary-dark/40">
                  {product.type.toUpperCase()}
                </p>
              </div>
              <span className="text-sm text-secondary-dark/60">
                {product.sold} units
              </span>
              <span className="text-sm font-medium text-secondary-dark/80">
                {formatPrice(product.revenue)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
