export const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase().trim()) {
    case "pending":
      return {
        label: "Pending",
        badge: "bg-yellow-100 text-yellow-700",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        badge: "bg-green-100 text-green-700",
        text: "text-green-700",
        dot: "bg-green-500",
      };

    case "completed":
      return {
        label: "Completed",
        badge: "bg-green-100 text-green-700",
        text: "text-green-700",
        dot: "bg-green-500",
      };

    case "failed":
      return {
        label: "Failed",
        badge: "bg-red-100 text-red-700",
        text: "text-red-700",
        dot: "bg-red-500",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        badge: "bg-gray-100 text-gray-600",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };

    case "refunded":
      return {
        label: "Refunded",
        badge: "bg-blue-100 text-blue-700",
        text: "text-blue-700",
        dot: "bg-blue-500",
      };

    case "paid":
      return {
        label: "Paid",
        badge: "bg-green-100 text-green-700",
        text: "text-green-700",
        dot: "bg-green-500",
      };

    default:
      return {
        label: status,
        badge: "bg-gray-100 text-gray-600",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };
  }
};
