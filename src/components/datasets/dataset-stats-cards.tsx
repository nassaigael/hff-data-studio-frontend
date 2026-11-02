"use client";

import { BarChart3, CheckCircle2, Database, Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import type { DatasetStatisticsResponse } from "@/types/dataset";

interface DatasetStatsCardsProps {
    statistics: DatasetStatisticsResponse | undefined;
    analysesCount?: number;
    exportsCount?: number;
}

export function DatasetStatsCards({
    statistics,
    analysesCount = 73,
    exportsCount = 45,
}: DatasetStatsCardsProps) {
    const total = statistics?.totalDatasets ?? 0;
    const cleaned = statistics?.cleanedDatasets ?? 0;
    const cleanedPercent = total > 0 ? Math.round((cleaned / total) * 100) : 0;

    const items = [
        {
            label: "Total des jeux de données",
            value: formatNumber(total),
            trend: `+${statistics?.newDatasetsLast30Days ?? 0} ce mois`,
            icon: Database,
            color: "text-hff-blue",
            bgColor: "bg-hff-blue/10",
        },
        {
            label: "Jeux de données nettoyés",
            value: formatNumber(cleaned),
            trend: `${cleanedPercent}% du total`,
            icon: CheckCircle2,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Analyses exécutées",
            value: formatNumber(analysesCount),
            trend: "+15 ce mois",
            icon: BarChart3,
            color: "text-hff-navy",
            bgColor: "bg-hff-yellow/20",
        },
        {
            label: "Exports réalisés",
            value: formatNumber(exportsCount),
            trend: "+10 ce mois",
            icon: Download,
            color: "text-purple-600",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
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
                            <p className="text-xl font-bold leading-none text-foreground">
                                {item.value}
                            </p>
                            <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] font-medium text-success">
                                {item.trend}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}