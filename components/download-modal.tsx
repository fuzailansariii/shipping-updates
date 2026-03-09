"use client";
import { useOrderDetailsStore } from "@/stores/orders-history-store";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { formatDate } from "@/utils/pdf-helper";
import DownloadButton from "./download-button";
import BottomSheetModal from "./bottom-sheet-modal";

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
    <BottomSheetModal
      isOpen={isDownloadModalOpen}
      onClose={closeDownloadModal}
      title="Download"
      subTitle={selectedOrder?.orderNumber}
    >
      {/* Date row */}
      <div className="px-2">
        <p className="text-xs text-gray-400">
          {selectedOrder && (
            <>Ordered on {formatDate(selectedOrder.createdAt)}</>
          )}
        </p>
      </div>

      {/* PDF Items */}
      <div className="overflow-y-auto flex-1 space-y-3 px-2 mb-4">
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
                className={`... ${isExhausted ? "bg-gray-100 opacity-70" : "bg-gray-50"} p-3 rounded-xl`}
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
    </BottomSheetModal>
  );
}
