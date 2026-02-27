import { create } from "zustand";

export interface OrderItems {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  productType: "pdf" | "book";
  downloadCount: number;
  maxDownloads: number;
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
  isDownloadModalOpen: boolean;
  selectedOrder: SelectedOrder | null;
  openOrderDetails: (order: SelectedOrder) => void;
  closeOrderDetails: () => void;
  openDownloadModal: (order: SelectedOrder) => void;
  closeDownloadModal: () => void;
  incrementDownloadCount: (OrderItemId: string) => void;
  decrementDownloadCount: (orderItemId: string) => void;
}

export const useOrderDetailsStore = create<OrderHistoryStore>((set) => ({
  isOpen: false,
  isDownloadModalOpen: false,
  selectedOrder: null,
  openOrderDetails: (order) => set({ isOpen: true, selectedOrder: order }),
  closeOrderDetails: () => set({ isOpen: false, selectedOrder: null }),
  openDownloadModal: (order) =>
    set({ isDownloadModalOpen: true, selectedOrder: order }),
  closeDownloadModal: () =>
    set({ isDownloadModalOpen: false, selectedOrder: null }),

  // Update download count
  incrementDownloadCount: (orderItemId: string) =>
    set((state) => {
      if (!state.selectedOrder) return state;

      return {
        selectedOrder: {
          ...state.selectedOrder,
          items: state.selectedOrder.items.map((item) =>
            item.id === orderItemId
              ? {
                  ...item,
                  downloadCount: item.downloadCount + 1,
                }
              : item,
          ),
        },
      };
    }),

  decrementDownloadCount: (orderItemId: string) =>
    set((state) => {
      if (!state.selectedOrder) return state;

      return {
        selectedOrder: {
          ...state.selectedOrder,
          items: state.selectedOrder.items.map((item) =>
            item.id === orderItemId
              ? {
                  ...item,
                  downloadCount: Math.max(item.downloadCount - 1, 0),
                }
              : item,
          ),
        },
      };
    }),
}));
