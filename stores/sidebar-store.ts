import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  // State
  isMobileMenuOpen: boolean;
  isDesktopSidebarOpen: boolean;

  // Action
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleDesktopSidebar: () => void;
  setDesktopSidebar: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      // Initial state
      isMobileMenuOpen: false,
      isDesktopSidebarOpen: true,

      // Mobile Menu Action
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      openMobileMenu: () => set({ isMobileMenuOpen: true }),

      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      toggleDesktopSidebar: () =>
        set((state) => ({ isDesktopSidebarOpen: !state.isDesktopSidebarOpen })),

      setDesktopSidebar: (isOpen: boolean) =>
        set({ isDesktopSidebarOpen: isOpen }),
    }),
    {
      name: "sidebar-desktop",

      partialize: (state) => ({
        isDesktopSidebarOpen: state.isDesktopSidebarOpen,
      }),
    }
  )
);
