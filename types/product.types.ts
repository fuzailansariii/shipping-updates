export type DashboardProduct = {
  id: string;
  title: string;
  type: "book" | "pdf";
  sold: number;
  revenue: number;
};

export type LowStockProduct = {
  id: string;
  title: string;
  stock: number;
};
