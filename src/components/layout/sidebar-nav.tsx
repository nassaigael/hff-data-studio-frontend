"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/stores/ui-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  active: boolean;
  collapsed: boolean;
}

function NavItem({ title, href, icon: Icon, active, collapsed }: NavItemProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "mx-auto h-11 w-11 justify-center" : "gap-3 px-3 py-2.5",
        active
          ? "bg-hff-yellow text-hff-navy shadow-lg shadow-hff-yellow/20"
          : "text-white/70 hover:bg-white/8 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      {active && !collapsed && (
        <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-hff-yellow" />
      )}

      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200",
          active ? "text-hff-navy" : "text-white/70 group-hover:text-white group-hover:scale-110"
        )}
      />

      {!collapsed && (
        <span className="truncate transition-opacity duration-200">{title}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function SidebarNav() {
  const pathname = usePathname();
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <nav
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-4 hff-scrollbar",
          collapsed ? "px-2" : "px-3"
        )}
      >
        <div className="space-y-1.5">
          {MAIN_NAVIGATION.map((section, sectionIdx) =>
            section.items.map((item) => (
              <NavItem
                key={item.href}
                title={item.title}
                href={item.href}
                icon={item.icon}
                exact={item.exact}
                active={isActive(item.href, item.exact)}
                collapsed={collapsed}
              />
            ))
          )}
        </div>

        <div className={cn("my-4 border-t border-white/10", collapsed && "mx-1")} />

        <div className="space-y-1.5">
          {SECONDARY_NAVIGATION.map((section) =>
            section.items.map((item) => (
              <NavItem
                key={item.href}
                title={item.title}
                href={item.href}
                icon={item.icon}
                exact={item.exact}
                active={isActive(item.href, item.exact)}
                collapsed={collapsed}
              />
            ))
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
}