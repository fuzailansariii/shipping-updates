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
  loading?: boolean;
  error?: string | null;
}

// ── Skeleton row for desktop ──
function SkeletonRow({ gridClassName }: { gridClassName: string }) {
  return (
    <div className={`grid ${gridClassName} items-center px-5 py-4 gap-2`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

// ── Skeleton card for mobile ──
function SkeletonCard() {
  return (
    <div className="bg-linear-to-r from-blue-200/50 to-neutral-200 border border-white/10 rounded-2xl px-5 py-4 space-y-3 shadow-md animate-pulse">
      <div className="flex justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-300 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>
    </div>
  );
}

export default function DataTable<T>({
  header,
  columns,
  data,
  gridClassName,
  renderMobileCard,
  renderRow,
  onRowClick,
  loading = false,
  error = null,
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

        {/* Loading state */}
        {loading ? (
          <div className="divide-y divide-white/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} gridClassName={gridClassName} />
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-10 text-center space-y-1">
            <p className="text-sm font-medium text-red-500">{error}</p>
            <p className="text-xs text-gray-400">
              Please try refreshing the page.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">No data found.</p>
          </div>
        ) : (
          /* Rows */
          <div className="divide-y divide-white/10 text-center cursor-pointer text-secondary-dark font-semibold font-lato">
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
        )}
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="px-4 py-8 text-center space-y-1">
            <p className="text-sm font-medium text-red-500">{error}</p>
            <p className="text-xs text-gray-400">
              Please try refreshing the page.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-400">No data found.</p>
          </div>
        ) : (
          data.map((item, i) => (
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
          ))
        )}
      </div>
    </div>
  );
}
