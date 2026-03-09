"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface Column {
  label: string;
  className?: string;
}

interface DataTableProps<T> {
  header?: ReactNode;
  columns: Column[];
  data: T[];
  gridClassName: string;
  renderRow: (item: T, index: number) => ReactNode;
  renderMobileCard: (item: T) => ReactNode;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  header,
  columns,
  data,
  gridClassName,
  renderMobileCard,
  renderRow,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      {/* Header */}
      {header}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-10 grid ${gridClassName} bg-linear-to-r from-blue-200 to-neutral-200 text-center px-5 py-3 text-xs font-semibold uppercase tracking-widest text-secondary-dark/80`}
        >
          {columns.map((col, i) => (
            <span key={i} className={`${col.className} truncate`}>
              {col.label}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/10 text-center cursor-pointer text-secondary-dark font-semibold font-nunito">
          {data.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.001 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
              }}
              className={`grid ${gridClassName} items-center px-5 py-4 gap-2 transition-all duration-300 hover:bg-white/5`}
              onClick={() => onRowClick?.(item)}
            >
              {renderRow(item, i)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(255,255,255,0.25)",
            }}
            className="bg-linear-to-r from-blue-200/50 to-neutral-200 border border-white/10 rounded-2xl px-5 py-4 space-y-3 shadow-md transition-all duration-300"
            onClick={() => onRowClick?.(item)}
          >
            {renderMobileCard(item)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
