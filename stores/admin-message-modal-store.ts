import { create } from "zustand";

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date | null;
};

type AdminMessageModalStore = {
  isOpen: boolean;
  selectedMessage: Message | null;
  openMessageModal: (message: Message) => void;
  closeMessageModal: () => void;
  markSelectedAsRead: () => void;
};

export const useAdminMessageModal = create<AdminMessageModalStore>((set) => ({
  isOpen: false,
  selectedMessage: null,
  openMessageModal: (message) =>
    set({ isOpen: true, selectedMessage: message }),
  closeMessageModal: () => set({ isOpen: false, selectedMessage: null }),
  markSelectedAsRead: () =>
    set((state) =>
      state.selectedMessage
        ? { selectedMessage: { ...state.selectedMessage, isRead: true } }
        : state,
    ),
}));
