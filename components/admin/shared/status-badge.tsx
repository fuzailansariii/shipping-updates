import React from "react";

export type Status =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "failed"
  | "completed"
  | "refunded";

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  packed: "bg-red-500/10 text-red-500 border border-red-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border border-green-500/20",
  failed: "bg-red-500/10 text-red-500 border border-red-500/20",
  completed: "bg-green-500/10 text-green-500 border border-green-500/20",
  refunded: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${statusStyles[status]} truncate`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
