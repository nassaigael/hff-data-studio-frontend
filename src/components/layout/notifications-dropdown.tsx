"use client";

import { Bell, CheckCheck, FileText, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

type NotificationType = "success" | "warning" | "info" | "upload";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
}

const ICONS: Record<NotificationType, typeof Bell> = {
    success: CheckCircle2,
    warning: AlertTriangle,
    info: FileText,
    upload: Upload,
};

const COLORS: Record<NotificationType, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-hff-navy/10 text-hff-navy",
    upload: "bg-hff-yellow/20 text-hff-navy",
};

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "success",
        title: "Analyse terminée",
        description: "Analyse financière Q2 a été exécutée avec succès.",
        time: "Il y a 5 min",
        isRead: false,
    },
    {
        id: "2",
        type: "upload",
        title: "Fichier importé",
        description: "Ventes_Mai_2026.xlsx a été traité (2 458 lignes).",
        time: "Il y a 1 h",
        isRead: false,
    },
    {
        id: "3",
        type: "warning",
        title: "Quota presque atteint",
        description: "Vous avez utilisé 90% de votre espace de stockage.",
        time: "Il y a 3 h",
        isRead: false,
    },
    {
        id: "4",
        type: "info",
        title: "Rapport disponible",
        description: "Le rapport mensuel de mai est prêt à télécharger.",
        time: "Il y a 5 h",
        isRead: true,
    },
];

export function NotificationsDropdown() {
    const notifications = MOCK_NOTIFICATIONS;
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ""}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-hff-yellow px-1 text-[10px] font-bold text-hff-navy shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-95 p-0" sideOffset={8}>
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-hff-yellow/20 px-2 py-0.5 text-[10px] font-bold text-hff-navy">
                                {unreadCount} nouvelles
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button className="flex items-center gap-1 text-xs font-medium text-hff-navy transition-colors hover:text-hff-blue">
                            <CheckCheck className="h-3.5 w-3.5" />
                            Tout lire
                        </button>
                    )}
                </div>

                <ScrollArea className="h-85">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = ICONS[notification.type];
                                return (
                                    <button
                                        key={notification.id}
                                        className={cn(
                                            "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                                            !notification.isRead && "bg-hff-yellow/3"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                                COLORS[notification.type]
                                            )}
                                        >
                                            <Icon className="h-4 w-4" strokeWidth={2.5} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold leading-tight">
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-hff-yellow" />
                                                )}
                                            </div>
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {notification.description}
                                            </p>
                                            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <div className="border-t p-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs font-medium"
                    >
                        <Link href="/notifications">Voir toutes les notifications</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}