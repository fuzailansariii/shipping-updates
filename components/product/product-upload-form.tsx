"use client";

import { ProductType } from "@/lib/validations/product.schema";
import BookUploadForm from "./book-form";
import PdfUploadForm from "./pdf-form";
import { useRef, useState } from "react";
import { BookOpen, FileText } from "lucide-react";
import ConfirmDialog from "../confirm-dialog";

export interface ChildFormRef {
  isDirty: boolean;
}

export const ProductUploadForm = () => {
  const [type, setType] = useState<ProductType>("book");
  const [pendingType, setPendingType] = useState<ProductType | null>(null);
  const childFormRef = useRef<ChildFormRef>(null);

  const handleTypeSwitch = (newType: ProductType) => {
    if (newType === type) return;

    // Check dirty state
    if (childFormRef.current?.isDirty) {
      setPendingType(newType);
      return;
    }

    setType(newType);
  };

  const handleConfirm = () => {
    if (pendingType) setType(pendingType);
    setPendingType(null);
  };

  const handleCancel = () => {
    setPendingType(null);
  };

  return (
    <div className="py-4 md:py-8">
      <div className="w-full md:max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Confirm dialog — only mounted when pendingType is set */}
        {pendingType && (
          <ConfirmDialog
            message={`Switching to "${pendingType}" will clear your current form.`}
            description="Any unsaved changes will be lost."
            confirmLabel="Switch anyway"
            cancelLabel="Keep editing"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">
            Add New Product
          </h1>
          <p className="mt-1 text-sm text-secondary-dark/60">
            Upload a BOOK or PDF and make it available for purchase.
          </p>
        </div>

        {/* Type switcher */}
        <div className="bg-neutral-100 rounded-2xl p-4 md:p-6 border border-gray-300">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Product Type
          </p>
          <div className="inline-flex rounded-full bg-gray-200 p-1 gap-1">
            <button
              type="button"
              onClick={() => handleTypeSwitch("book")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                type === "book"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Book
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch("pdf")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                type === "pdf"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>

        {type === "book" ? (
          <BookUploadForm key="book-form" ref={childFormRef} />
        ) : (
          <PdfUploadForm key="pdf-form" ref={childFormRef} />
        )}
      </div>
    </div>
  );
};
