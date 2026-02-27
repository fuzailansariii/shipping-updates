"use client";
import { useOrderDetailsStore } from "@/stores/orders-history-store";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { formatDate } from "@/utils/pdf-helper";
import DownloadButton from "./download-button";

export default function DownloadModal() {
  const { isDownloadModalOpen, closeDownloadModal, selectedOrder } =
    useOrderDetailsStore();

  useEffect(() => {
    if (isDownloadModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isDownloadModalOpen]);

  const pdfItems =
    selectedOrder?.items?.filter((item) => item.productType === "pdf") ?? [];

  return (
    <AnimatePresence mode="wait">
      {isDownloadModalOpen && selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDownloadModal}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-lg h-[82vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Drag handle - mobile only */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Downloads
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDownloadModal}>
                <X className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Date row */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-xs text-gray-400">
                Ordered on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* PDF Items */}
            <div className="px-5 overflow-y-auto flex-1 py-3 space-y-3 mb-4">
              {pdfItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">
                  No downloadable items in this order.
                </p>
              ) : (
                pdfItems.map((item, index) => {
                  const remaining = item.maxDownloads - item.downloadCount;
                  const isExhausted = remaining <= 0;

                  return (
                    <div
                      key={item.id || index}
                      className={`... ${isExhausted ? "bg-gray-100 opacity-70" : "bg-gray-50"} p-3`}
                    >
                      <div className="min-w-0 flex justify-between items-center gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {item.productTitle}
                          </p>
                          <div className="text-xs mt-0.5">
                            {isExhausted ? (
                              <span className="text-red-500 font-medium">
                                Download limit reached
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                {item.downloadCount}/{item.maxDownloads} used ·{" "}
                                <span className="text-green-600 font-medium">
                                  {remaining} left
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Keep button visible until fully exhausted */}
                        {!isExhausted && (
                          <DownloadButton
                            orderItemId={item.id}
                            orderItemTitle={item.productTitle}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
