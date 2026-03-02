import React from "react";
import SectionHeader from "../shared/section-header";
import LowStockItem from "../shared/low-stock-item";
import { motion } from "framer-motion";

interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
}

interface LowStockListProps {
  products: LowStockProduct[];
}

export default function LowStockList({ products }: LowStockListProps) {
  return (
    <div className="w-full md:flex-1">
      <SectionHeader
        title="Low Stock"
        href="/admin/products"
        hrefLabel="View all"
      />
      <div className="rounded-2xl border border-white/7 overflow-hidden divide-y divide-white/5">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <LowStockItem stock={product.stock} title={product.title} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
