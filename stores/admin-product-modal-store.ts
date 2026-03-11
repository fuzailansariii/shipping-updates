import { Product } from "@/utils/db/schema";
import { create } from "zustand";

type AdminProductModalStore = {
  isOpen: boolean;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  updateSelectedProduct: (product: Product) => void;
};

export const useAdminProductModal = create<AdminProductModalStore>((set) => ({
  isOpen: false,
  selectedProduct: null,
  openProductModal: (product) =>
    set({ isOpen: true, selectedProduct: product }),
  closeProductModal: () => set({ isOpen: false, selectedProduct: null }),
  updateSelectedProduct: (product) => set({ selectedProduct: product }),
}));
