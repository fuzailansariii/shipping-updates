"use client";

import BottomSheetModal from "@/components/bottom-sheet-modal";
import { Button } from "@/components/ui/button";
import { useAdminProductModal } from "@/stores/admin-product-modal-store";
import { formatPrice } from "@/utils/checkout-helper";
import { formatDate } from "@/utils/pdf-helper";
import axios from "axios";
import {
  BookOpen,
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Loader2,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5">
      <span className="text-xs text-gray-400 font-medium shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium text-right">
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminProductModal() {
  const { isOpen, selectedProduct, closeProductModal } = useAdminProductModal();

  const router = useRouter();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever a new product is opened
  React.useEffect(() => {
    if (selectedProduct) {
      setConfirmingDelete(false);
      setError(null);
    }
  }, [selectedProduct?.id]);

  // ── Delete handler ──
  async function handleDelete() {
    if (!selectedProduct) return;
    setDeleting(true);
    setError(null);

    try {
      await axios.delete(`/api/admin/products/${selectedProduct.id}`);
      toast.success(`"${selectedProduct.title}" deleted.`);
      router.refresh();
      closeProductModal();
    } catch (err: any) {
      const message =
        err?.response?.data?.error ??
        err?.message ??
        "Failed to delete product.";
      setError(message);
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const isBook = selectedProduct?.type === "book";

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={closeProductModal}
      title="Product Details"
      subTitle={selectedProduct?.title ?? "—"}
    >
      {selectedProduct ? (
        <>
          {/* ── Product Identity ── */}
          <div className="flex items-center gap-3 px-2">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                isBook
                  ? "bg-purple-50 text-purple-500"
                  : "bg-blue-50 text-blue-500",
              )}
            >
              {isBook ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {selectedProduct.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full capitalize",
                    isBook
                      ? "bg-purple-50 text-purple-700"
                      : "bg-blue-50 text-blue-700",
                  )}
                >
                  {selectedProduct.type}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                    selectedProduct.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {selectedProduct.isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {selectedProduct.isActive ? "Active" : "Inactive"}
                </span>
                {selectedProduct.isFeatured && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Read-only Details ── */}
          <div className="px-2 space-y-0.5">
            <SectionLabel>Details</SectionLabel>
            <InfoRow
              label="Created"
              value={formatDate(selectedProduct.createdAt)}
            />
            <InfoRow label="Price" value={formatPrice(selectedProduct.price)} />
            {isBook && (
              <>
                <InfoRow
                  label="Stock"
                  value={`${selectedProduct.stockQuantity} item(s)`}
                />
                {selectedProduct.author && (
                  <InfoRow label="Author" value={selectedProduct.author} />
                )}
                {selectedProduct.publisher && (
                  <InfoRow
                    label="Publisher"
                    value={selectedProduct.publisher}
                  />
                )}
                {selectedProduct.edition && (
                  <InfoRow label="Edition" value={selectedProduct.edition} />
                )}
                {selectedProduct.isbn && (
                  <InfoRow label="ISBN" value={selectedProduct.isbn} />
                )}
              </>
            )}
            <InfoRow label="Language" value={selectedProduct.language} />
            {selectedProduct.topics?.length > 0 && (
              <div className="flex justify-between items-start gap-4 py-1.5">
                <span className="text-xs text-gray-400 font-medium shrink-0">
                  Topics
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {selectedProduct.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Actions ── */}
          <div className="px-2 space-y-3">
            <SectionLabel>Actions</SectionLabel>
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600"
              onClick={() => {
                closeProductModal();
                router.push(`/admin/products/${selectedProduct.id}/edit`);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit Product
            </Button>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Danger Zone ── */}
          <div className="px-2 space-y-3">
            <SectionLabel>Danger Zone</SectionLabel>

            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            {!confirmingDelete ? (
              <Button
                variant="outline"
                className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={() => setConfirmingDelete(true)}
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
              </Button>
            ) : (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">"{selectedProduct.title}"</span>
                    ? This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Confirm Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="h-4" />
        </>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10 px-2">
          No product selected.
        </p>
      )}
    </BottomSheetModal>
  );
}
