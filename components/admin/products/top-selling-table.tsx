import React from "react";
import SectionHeader from "../shared/section-header";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/checkout-helper";
import DataTable from "../shared/data-table";
import StatusBadge from "../shared/status-badge";

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
    <DataTable
      header={
        <SectionHeader
          title="Top Selling Products"
          href="/admin/products"
          hrefLabel="View all"
        />
      }
      columns={[{ label: "Product" }, { label: "Sold" }, { label: "Revenue" }]}
      data={products}
      gridClassName="grid-cols-3"
      renderRow={(product) => (
        <>
          <span className="text-sm font-medium text-secondary-dark/80 truncate text-start">
            {product.title}
          </span>
          <span className="text-sm text-secondary-dark/60 truncate">
            {product.sold} Units
          </span>
          <span className="text-sm font-medium text-secondary-dark/80">
            {formatPrice(product.revenue)}
          </span>
        </>
      )}
      renderMobileCard={(product) => (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-secondary-dark/80 line-clamp-1">
              {product.title}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-secondary-dark/70">
                {product.type.toUpperCase()}
              </p>
              <p className="text-sm text-secondary-dark/60">
                {product.sold} units
              </p>
            </div>
            <span className="text-sm font-semibold text-secondary-dark/80">
              {formatPrice(product.revenue)}
            </span>
          </div>
        </>
      )}
    />
  );
}
