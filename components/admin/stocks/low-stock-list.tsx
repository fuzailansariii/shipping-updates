"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../shared/section-header";
import LowStockItem from "../shared/low-stock-item";

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
      <div className="rounded-2xl border border-white/6 bg-white/2 backdrop-blur-sm overflow-hidden">
        <AnimatePresence>
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-b border-white/4 last:border-0"
            >
              <LowStockItem stock={product.stock} title={product.title} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
