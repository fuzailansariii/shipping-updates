import { create } from "zustand";

interface ProfileStore {
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  toggleProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isProfileOpen: false,
  openProfile: () => set({ isProfileOpen: true }),
  closeProfile: () => set({ isProfileOpen: false }),
  toggleProfile: () =>
    set((state) => ({ isProfileOpen: !state.isProfileOpen })),
}));
