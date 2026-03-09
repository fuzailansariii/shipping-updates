"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Product } from "@/utils/db/schema";
import { formatPrice } from "@/utils/checkout-helper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import DataTable from "@/components/admin/shared/data-table";
import { useAdminProductModal } from "@/stores/admin-product-modal-store";
import AdminProductModal from "@/components/admin/admin-product-modal";
import { formatDate } from "@/utils/pdf-helper";

type FilterType = "all" | "book" | "pdf";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { openProductModal } = useAdminProductModal();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/admin/products", {
          signal: controller.signal,
        });
        setProducts(res.data?.products ?? []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setError("You are not authorized to view this page.");
          } else {
            setError("Failed to load products. Please try again.");
          }
        } else {
          setError("Something went wrong while loading products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [userId, isLoaded]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.topics?.some((topic) =>
          topic.toLowerCase().includes(query.toLowerCase()),
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
            onClick={() => router.push("/admin/pdfs")}
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
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, topic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 bg-gray-50"
              />
            </div>

            {/* Type filter */}
            <div className="inline-flex rounded-full bg-gray-50 border border-gray-200 p-1 text-xs">
              {(["all", "book", "pdf"] as FilterType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors",
                    typeFilter === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-white",
                  )}
                >
                  {type === "book" && <BookOpen className="w-3 h-3" />}
                  {type === "pdf" && <FileText className="w-3 h-3" />}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="inline-flex rounded-full bg-gray-50 border border-gray-200 p-1 text-xs">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors",
                    statusFilter === status
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-white",
                  )}
                >
                  {status === "active" && <CheckCircle2 className="w-3 h-3" />}
                  {status === "inactive" && <XCircle className="w-3 h-3" />}
                  <span className="capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 items-center animate-pulse py-2 border-b last:border-b-0 border-gray-100 px-2"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gray-100" />
                    <div className="space-y-1 w-3/4">
                      <div className="h-3 bg-gray-100 rounded" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-gray-100 rounded w-20" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-gray-100 rounded w-20" />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <div className="h-8 w-8 rounded-md bg-gray-100" />
                    <div className="h-8 w-8 rounded-md bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <p className="text-xs text-gray-500">
                If you believe this is a mistake, please check your admin
                permissions.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-base font-semibold text-gray-800">
                No products found
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Try adjusting your filters or search query, or add a new product
                to get started.
              </p>
            </div>
          ) : (
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
                  <span className="text-sm font-medium truncate">
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
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              )}
            />
          )}
        </div>
      </div>

      {/* Modal — lives outside the page div, at root level */}
      <AdminProductModal />
    </>
  );
}
