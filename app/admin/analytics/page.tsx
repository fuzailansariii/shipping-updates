"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6"
      >
        <BarChart3 className="w-10 h-10 text-blue-400" />
      </motion.div>

      {/* Animated bars — decorative */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-end gap-1.5 mb-8"
      >
        {[40, 65, 45, 80, 55, 90, 60].map((height, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              delay: 0.3 + i * 0.07,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            style={{ height: `${height}px`, originY: 1 }}
            className="w-6 rounded-t-md bg-linear-to-t from-blue-400 to-blue-200 opacity-60"
          />
        ))}
      </motion.div>

      {/* Text */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-bold text-secondary-dark mb-2"
      >
        Analytics Coming Soon
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-secondary-dark/50 text-center max-w-xs"
      >
        We're building detailed insights for your orders, revenue, and product
        performance. Check back soon.
      </motion.p>

      {/* Pulsing dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 mt-6"
      >
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-blue-400 inline-block"
        />
        <span className="text-xs text-secondary-dark/40 font-medium">
          In development
        </span>
      </motion.div>
    </div>
  );
}
