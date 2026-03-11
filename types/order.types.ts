import { Order, OrderItem } from "@/utils/db/schema";
import { Status } from "@/components/admin/shared/status-badge";

export type OrderWithItems = Order & { items: OrderItem[] };

export type DashboardOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: Status;
};
