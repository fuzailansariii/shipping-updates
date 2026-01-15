import { create } from "zustand";

interface Product {
  type: "book" | "pdf";
  id: string;
  title: string;
  description: string;
  price: number;
  fileSize?: number;
  topics: string[];
  thumbnail: string | null;
  stockQuantity?: number;
  isbn?: string;
  publisher?: string;
  author?: string;
  edition?: string;
  language?: string;
  isActive: boolean;
}

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
