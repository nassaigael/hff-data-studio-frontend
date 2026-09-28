import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReactNode } from "react";

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  headerActions: ReactNode | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setHeaderActions: (actions: ReactNode | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      headerActions: null,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setHeaderActions: (actions) => set({ headerActions: actions }),
    }),
    {
      name: "hff_ui_state",
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);