"use client";

import { Archive, CheckCircle2, Clock, FolderKanban } from "lucide-react";
import { useProjectStatistics } from "@/hooks/use-projects";
import { cn } from "@/lib/utils/cn";

interface StatItem {
    label: string;
    value: number | undefined;
    icon: typeof FolderKanban;
    color: string;
    bgColor: string;
}

export function ProjectStatistics() {
    const { data: statistics } = useProjectStatistics();

    if (!statistics) return null;

    const items: StatItem[] = [
        {
            label: "Projets",
            value: statistics.totalProjects,
            icon: FolderKanban,
            color: "text-hff-blue",
            bgColor: "bg-hff-blue/10",
        },
        {
            label: "En cours",
            value: statistics.inProgress,
            icon: Clock,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Terminés",
            value: statistics.completed,
            icon: CheckCircle2,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Archivés",
            value: statistics.archived,
            icon: Archive,
            color: "text-muted-foreground",
            bgColor: "bg-muted",
        },
    ];

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
                Statistiques globales
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-3"
                        >
                            <div
                                className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                    item.bgColor,
                                    item.color
                                )}
                            >
                                <Icon className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-bold leading-none text-foreground">
                                    {item.value ?? 0}
                                </p>
                                <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}