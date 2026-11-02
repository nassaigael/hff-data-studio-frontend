"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { NotificationsDropdown } from "./notifications-dropdown";
import { SearchCommand } from "./search-command";
import { Breadcrumbs } from "./breadcrumbs";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { useBreadcrumbs } from "@/providers/breadcrumbs-provider";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBreadcrumbs?: boolean;
}

export function Header({ title, subtitle, showBreadcrumbs = false }: HeaderProps) {
  const setMobileOpen = useUIStore((state) => state.setMobileSidebarOpen);
  const headerActions = useUIStore((state) => state.headerActions);
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { dynamicLabels } = useBreadcrumbs();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // handled by useAuth
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl lg:gap-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 flex-1 lg:block">
        {showBreadcrumbs ? (
          <Breadcrumbs dynamicLabels={dynamicLabels} />
        ) : (
          title && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )
        )}
      </div>

      {headerActions && (
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {headerActions}
        </div>
      )}

      <div className="hidden max-w-md flex-1 md:block lg:max-w-lg">
        <SearchCommand />
      </div>

      <div className="ml-auto flex items-center gap-1 lg:gap-1.5">
        <NotificationsDropdown />
        <ThemeToggle />
        <div className="mx-1 hidden h-6 w-px bg-border lg:block" />
        <UserMenu user={user ?? undefined} onLogout={handleLogout} />
      </div>
    </header>
  );
}