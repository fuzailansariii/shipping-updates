"use client";

import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface ConfirmDialogProps {
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  description,
  confirmLabel = "Continue anyway",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    // Backdrop — click outside to cancel
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      >
        {/* Dialog panel — stop propagation so clicks inside don't close it */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white rounded-2xl border border-gray-300 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="h-11 rounded-xl w-11 bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>

            {/* Text */}
            <h2 className="text-lg font-semibold text-secondary-dark mb-1">
              Unsaved changes
            </h2>
          </div>
          <p className="text-sm text-secondary-dark/60 leading-relaxed mb-6 text-center">
            {message}
            {description && <span className="block mt-1">{description}</span>}
          </p>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold text-secondary-dark bg-neutral-100 border border-gray-300 hover:bg-neutral-200 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-500/20"
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
