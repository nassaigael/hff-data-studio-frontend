"use client";

import { LogOut, User as UserIcon, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils/format";

interface UserMenuUser {
  firstName: string;
  lastName: string;
  email: string;
  roleLabel?: string;
  avatarUrl?: string;
}

interface UserMenuProps {
  user?: UserMenuUser;
  onLogout?: () => void;
}

const FALLBACK_USER: UserMenuUser = {
  firstName: "Utilisateur",
  lastName: "",
  email: "user@hff.re",
  roleLabel: "Data Analyst",
};

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const currentUser: UserMenuUser = user ?? FALLBACK_USER;
  const initials = getInitials(currentUser.firstName, currentUser.lastName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted"
          aria-label="Menu utilisateur"
        >
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.firstName} />
            <AvatarFallback className="text-[11px] font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold leading-tight">
              {currentUser.firstName} {currentUser.lastName.charAt(0)}.
            </div>
            <div className="text-[10px] font-medium text-muted-foreground">
              {currentUser.roleLabel}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60" sideOffset={8}>
        <DropdownMenuLabel className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.firstName} />
              <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer py-2.5">
            <UserIcon className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer py-2.5">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer py-2.5">
            <HelpCircle className="mr-2 h-4 w-4" />
            Centre d&apos;aide
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer py-2.5 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}