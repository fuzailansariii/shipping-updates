export type OrderStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded"
  | "paid";

type StatusConfig = {
  label: string;
  badge: string;
  text: string;
  dot: string;
};

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },

  confirmed: {
    label: "Confirmed",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },

  completed: {
    label: "Completed",
    badge: "bg-green-100 text-green-700 border border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },

  paid: {
    label: "Paid",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },

  failed: {
    label: "Failed",
    badge: "bg-red-100 text-red-700 border border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
  },

  cancelled: {
    label: "Cancelled",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },

  refunded: {
    label: "Refunded",
    badge: "bg-purple-100 text-purple-700 border border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
};

export const getStatusConfig = (status?: string): StatusConfig => {
  const key = status?.toLowerCase().trim() as OrderStatus;

  return (
    STATUS_CONFIG[key] ?? {
      label: status ?? "Unknown",
      badge: "bg-gray-100 text-gray-600 border border-gray-200",
      text: "text-gray-600",
      dot: "bg-gray-400",
    }
  );
};
