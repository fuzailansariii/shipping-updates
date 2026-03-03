"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/checkout-helper";

interface AdminMenuCardProps {
  title: string;
  count: number;
  isCurrency?: boolean;
}

export default function AdminMenuCard({
  title,
  count,
  isCurrency,
}: AdminMenuCardProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (count === 0) {
      setDisplayCount(0);
      return;
    }

    setIsFinished(false);

    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * count));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayCount(count);
        setIsFinished(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.05, ease: "linear" }}
      className="group relative bg-primary-dark/20 border border-white/[0.07] rounded-2xl px-5 py-4 w-full flex flex-col gap-1.5 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 cursor-default"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/4 transition-all duration-300 rounded-2xl" />

      {/* Top accent line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Count */}
      <motion.p
        key={displayCount}
        animate={isFinished ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-secondary-dark/70 tracking-tight leading-none tabular-nums z-10"
      >
        {isCurrency ? formatPrice(displayCount) : displayCount.toString()}
      </motion.p>

      {/* Title */}
      <p className="text-[11px] font-semibold text-secondary-dark/50 uppercase tracking-widest z-30">
        {title}
      </p>
    </motion.div>
  );
}
