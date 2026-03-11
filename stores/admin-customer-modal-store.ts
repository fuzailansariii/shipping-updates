import { create } from "zustand";

export type Customer = {
  id: string; // Clerk user ID
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  imageUrl: string;
  createdAt: number; // Clerk returns this as a Unix timestamp
  lastSignInAt: number | null;
};

type AdminCustomerModalStore = {
  isOpen: boolean;
  selectedCustomer: Customer | null;
  openCustomerModal: (customer: Customer) => void;
  closeCustomerModal: () => void;
};

export const useAdminCustomerModal = create<AdminCustomerModalStore>((set) => ({
  isOpen: false,
  selectedCustomer: null,
  openCustomerModal: (customer) =>
    set({ isOpen: true, selectedCustomer: customer }),
  closeCustomerModal: () => set({ isOpen: false, selectedCustomer: null }),
}));
