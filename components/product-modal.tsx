"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useProductModalStore } from "@/stores/product-store";
import { Image } from "@imagekit/next";
import {
  BookOpen,
  File,
  FileText,
  User,
  Globe,
  Layers,
  Hash,
  X,
  Edit,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { formatFileSize } from "@/utils/pdf-helper";
import { useUserRole } from "@/lib/hooks/useUserRole";
import Link from "next/link";

export default function ProductModal() {
  const { isProductModalOpen, closeProductModal, selectedProduct } =
    useProductModalStore();

  // User role
  const { isAdmin } = useUserRole();

  useEffect(() => {
    document.body.style.overflow = isProductModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isProductModalOpen]);

  return (
    <AnimatePresence>
      {isProductModalOpen && selectedProduct && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProductModal}
          className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center"
        >
          <motion.div
            key="modal"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-3xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* ---------- HEADER ---------- */}
            <div className="relative p-4 border-b shrink-0">
              <h2 className="text-base md:text-lg font-semibold pr-10 line-clamp-2">
                {selectedProduct.title}
              </h2>
              <Button
                onClick={closeProductModal}
                variant="ghost"
                className="absolute top-2 right-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* ---------- CONTENT ---------- */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col md:flex-row gap-5">
                {/* IMAGE */}
                <div className="relative md:w-1/2 aspect-4/3 bg-gray-100 rounded-xl flex items-center justify-center">
                  {selectedProduct.thumbnail ? (
                    <Image
                      urlEndpoint={selectedProduct.thumbnail}
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.title}
                      fill
                      priority
                      className="object-contain p-3"
                    />
                  ) : (
                    <File className="w-14 h-14 text-gray-300" />
                  )}

                  {/* TYPE BADGE */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      selectedProduct.type === "book"
                        ? "bg-purple-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {selectedProduct.type === "book" ? (
                      <>
                        <BookOpen size={14} /> Book
                      </>
                    ) : (
                      <>
                        <FileText size={14} /> PDF
                      </>
                    )}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="text-xl font-bold text-green-700">
                    ₹{selectedProduct.price.toFixed(2)}
                  </div>

                  {/* TOPICS */}
                  {selectedProduct.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs rounded-md bg-blue-50 text-blue-700 font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* META INFO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {selectedProduct.author && (
                      <InfoItem
                        icon={User}
                        label="Author"
                        value={selectedProduct.author}
                      />
                    )}

                    {selectedProduct.language && (
                      <InfoItem
                        icon={Globe}
                        label="Language"
                        value={selectedProduct.language}
                      />
                    )}
                    {selectedProduct.edition && (
                      <InfoItem
                        icon={Hash}
                        label="Edition"
                        value={selectedProduct.edition}
                      />
                    )}
                    {selectedProduct.publisher && (
                      <InfoItem
                        icon={Layers}
                        label="Publisher"
                        value={selectedProduct.publisher}
                      />
                    )}
                    {/* PDF ONLY */}
                    {selectedProduct.type === "pdf" &&
                      typeof selectedProduct.fileSize === "number" && (
                        <InfoItem
                          icon={File}
                          label="File Size"
                          value={formatFileSize(selectedProduct.fileSize)}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- SMALL REUSABLE COMPONENT ---------- */
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );
}
