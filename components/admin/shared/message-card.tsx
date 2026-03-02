import React from "react";

interface MessageCardProps {
  customer: string;
  message: string;
  time: string;
}

export default function MessageCard({
  customer,
  message,
  time,
}: MessageCardProps) {
  return (
    <div className="px-4 py-3 hover:bg-black/2 transition-colors duration-200 gap-2 rounded-md cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-secondary-dark/80">
          {customer}
        </p>
        <span className="text-[10px] text-secondary-dark/40">{time}</span>
      </div>
      <p className="text-xs text-secondary-dark/50 line-clamp-2">{message}</p>
    </div>
  );
}
