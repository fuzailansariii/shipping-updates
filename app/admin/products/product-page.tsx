"use client";

import { useCallback, useMemo, useState } from "react";
import { Filter, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/utils/db/schema";
import { formatPrice } from "@/utils/checkout-helper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/admin/shared/data-table";
import { useAdminProductModal } from "@/stores/admin-product-modal-store";
import AdminProductModal from "@/components/admin/admin-product-modal";
import { formatDate } from "@/utils/pdf-helper";
import ErrorState from "@/components/admin/shared/error-state";

interface AdminProductPageProps {
  initialProducts: Product[];
  error: string | null;
  currentPage: number;
}

export default function ProductsPage({
  initialProducts,
  error,
  currentPage,
}: AdminProductPageProps) {
  const [products, setProducts] = useState(initialProducts);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Current filter value from the URL

  const query = searchParams.get("query") ?? "";
  const typeFilter = searchParams.get("type") ?? "all";
  const statusFilter = searchParams.get("status") ?? "all";

  // This function updates the URL when a filter changes
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // reset to page 1 when filter change
      params.delete("page");
      // This triggers Next.js to rerun the server component with new params
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const { openProductModal } = useAdminProductModal();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Client side — just title and topics
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.topics?.some((t) =>
          t.toLowerCase().includes(query.toLowerCase()),
        );

      const matchesType =
        typeFilter === "all" ? true : product.type === typeFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? product.isActive
            : !product.isActive;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [products, query, typeFilter, statusFilter]);

  if (error) return <ErrorState message={error} />;

  return (
    <>
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-dark">Products</h1>
            <p className="mt-1 text-sm text-secondary-dark/60">
              Manage your books and PDFs, adjust inventory, and control
              visibility.
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm w-fit"
            onClick={() => router.push("/admin/products/new")}
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>

          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
            {/* Type filter */}
            <div className="flex flex-col md:flex-row items-center overflow-hidden overflow-y-auto gap-3">
              <div className="inline-flex rounded-full bg-gray-50 border border-gray-200 p-1 text-xs">
                {(["all", "book", "pdf"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateFilter("type", type)}
                    className={cn(
                      "px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors",
                      typeFilter === type
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="inline-flex rounded-full bg-gray-50 border border-gray-200 p-1 text-xs">
                {/* Status filter buttons */}
                {(["all", "active", "inactive"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateFilter("status", status)}
                    className={cn(
                      "px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors",
                      statusFilter === status
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <DataTable
          columns={[
            { label: "Product" },
            { label: "Price" },
            { label: "Inventory" },
            { label: "Status" },
            { label: "Last Update" },
          ]}
          data={filteredProducts}
          onRowClick={(product) => openProductModal(product)}
          gridClassName="grid-cols-5"
          renderRow={(product) => (
            <>
              <span className="text-sm font-semibold truncate">
                {product.title}
              </span>
              <span className="text-sm truncate">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm truncate">
                {product.type === "book"
                  ? `${product.stockQuantity ?? 0} in stock`
                  : "Digital"}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  product.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs font-medium">
                {formatDate(product.updatedAt)}
              </span>
            </>
          )}
          loading={false}
          error={null}
          renderMobileCard={(product) => (
            <div className="flex items-center justify-between font-nunito">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-secondary-dark/80">
                  {product.title}
                </p>
                <p className="text-xs text-secondary-dark/70">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-secondary-dark/40">
                  {product.type === "book"
                    ? `${product.stockQuantity ?? 0} in stock`
                    : "Digital file"}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  product.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          )}
        />
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => updateFilter("page", String(currentPage - 1))}
          className="h-8 px-2.5 text-xs rounded-lg"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <span className="text-xs font-medium text-neutral-500 px-1">
          Page {currentPage}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={initialProducts.length < 20}
          onClick={() => updateFilter("page", String(currentPage + 1))}
          className="h-8 px-2.5 text-xs rounded-lg"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Modal — lives outside the page div, at root level */}
      <AdminProductModal />
    </>
  );
}
