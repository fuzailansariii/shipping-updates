import { OrderWithItems } from "@/types";
import { create } from "zustand";

type AdminOrderModalStore = {
  isOpen: boolean;
  selectedOrder: OrderWithItems | null;
  openModal: (order: OrderWithItems) => void;
  closeModal: () => void;
  updateSelectedOrder: (order: OrderWithItems) => void;
};

export const useAdminOrderModal = create<AdminOrderModalStore>((set) => ({
  isOpen: false,
  selectedOrder: null,
  openModal: (order) => set({ isOpen: true, selectedOrder: order }),
  closeModal: () => set({ isOpen: false, selectedOrder: null }),
  updateSelectedOrder: (order) => set({ selectedOrder: order }),
}));
