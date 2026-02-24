import { create } from "zustand";

export interface OrderItems {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  productType: "pdf" | "book";
}

type SelectedOrder = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  totalAmount: number;
  subTotal?: number;
  tax?: number;
  discount?: number;
  shippingCharges?: number;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt: string;
  items: OrderItems[];
};

interface OrderHistoryStore {
  isOpen: boolean;
  selectedOrder: SelectedOrder | null;
  openOrderDetails: (order: SelectedOrder) => void;
  closeOrderDetails: () => void;
}

export const useOrderDetailsStore = create<OrderHistoryStore>((set) => ({
  isOpen: false,
  selectedOrder: null,
  openOrderDetails: (order) => set({ isOpen: true, selectedOrder: order }),
  closeOrderDetails: () => set({ isOpen: false, selectedOrder: null }),
}));
