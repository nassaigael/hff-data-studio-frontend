"use client";

import { BarChart3, Database, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ProjectResponse } from "@/types/project";

interface ProjectStatsGridProps {
    project: ProjectResponse;
}

interface StatItem {
    label: string;
    value: number;
    icon: typeof Database;
    color: string;
    bgColor: string;
}

export function ProjectStatsGrid({ project }: ProjectStatsGridProps) {
    const items: StatItem[] = [
        {
            label: "Jeux de données",
            value: project.datasetCount ?? 0,
            icon: Database,
            color: "text-hff-blue",
            bgColor: "bg-hff-blue/10",
        },
        {
            label: "Analyses",
            value: project.analysisCount ?? 0,
            icon: BarChart3,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Rapports",
            value: project.reportCount ?? 0,
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-500/10",
        },
        {
            label: "Exports",
            value: 0,
            icon: Download,
            color: "text-purple-600",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div
                            className={cn(
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                                item.bgColor,
                                item.color
                            )}
                        >
                            <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold leading-none text-foreground">
                                {item.value}
                            </p>
                            <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                {item.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}