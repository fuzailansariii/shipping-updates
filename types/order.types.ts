import { Order, OrderItem } from "@/utils/db/schema";
import { OrderStatus } from "@/utils/status-badge";

export type OrderWithItems = Order & { items: OrderItem[] };

export type DashboardOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
};
