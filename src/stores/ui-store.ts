import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReactNode } from "react";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  headerActions: ReactNode | null;
  setHeaderActions: (actions: ReactNode | null) => void;

  isDatasetMaximized: boolean;
  toggleDatasetMaximized: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      headerActions: null,
      setHeaderActions: (actions) => set({ headerActions: actions }),

      isDatasetMaximized: false,
      toggleDatasetMaximized: () => set((state) => ({ isDatasetMaximized: !state.isDatasetMaximized })),
    }),
    {
      name: "hff-ui-store",
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);