"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Changer de thème">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          aria-label="Changer de thème"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-11 p-1">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-0",
            theme === "light" && "bg-hff-yellow/20 text-hff-navy"
          )}
          aria-label="Thème clair"
        >
          <Sun className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-0",
            theme === "dark" && "bg-hff-yellow/20 text-hff-navy"
          )}
          aria-label="Thème sombre"
        >
          <Moon className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-0",
            theme === "system" && "bg-hff-yellow/20 text-hff-navy"
          )}
          aria-label="Thème système"
        >
          <Monitor className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}