"use client";

import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";
import { SidebarFooter } from "./sidebar-footer";

interface SidebarProps {
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

export function Sidebar({ variant = "desktop", onClose }: SidebarProps) {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const isMobile = variant === "mobile";
  const isCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-hff-navy transition-[width] duration-300 ease-in-out",
        isMobile
          ? "w-72"
          : cn("sticky top-0 hidden lg:flex", isCollapsed ? "w-20" : "w-64")
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {!isCollapsed && (
          <div className="flex min-w-0 flex-1 items-center">
            <Logo context="sidebar" size="md" href="/" />
          </div>
        )}

        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="group flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/8"
            aria-label="Ouvrir la sidebar"
          >
            <Logo context="sidebar" size="sm" />
          </button>
        )}

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 shrink-0 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Réduire la sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )
        )}
      </div>

      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}