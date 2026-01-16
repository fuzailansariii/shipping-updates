import { Product } from "@/utils/db/schema";
import { create } from "zustand";

interface ProductModalStore {
  isProductModalOpen: boolean;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
}

export const useProductModalStore = create<ProductModalStore>((set) => ({
  isProductModalOpen: false,
  selectedProduct: null,
  openProductModal: (product) =>
    set({ isProductModalOpen: true, selectedProduct: product }),
  closeProductModal: () =>
    set({ isProductModalOpen: false, selectedProduct: null }),
}));
