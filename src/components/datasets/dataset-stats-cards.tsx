"use client";

import { BarChart3, CheckCircle2, Database, Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import type { Stats } from "@/lib/api/stats";

interface DatasetStatsCardsProps {
    stats: Stats | null | undefined;
    loading?: boolean;
}

export function DatasetStatsCards({ stats, loading = false }: DatasetStatsCardsProps) {
    const total = stats?.totalDatasets ?? 0;
    const cleaned = stats?.cleanedDatasets ?? 0;
    const cleanedPercent = total > 0 ? Math.round((cleaned / total) * 100) : 0;
    const newLast30Days = stats?.newDatasetsLast30Days ?? 0;
    const totalAnalysesRun = stats?.totalAnalysesRun ?? 0;
    const totalExports = stats?.totalExports ?? 0;

    const items = [
        {
            label: "Total des jeux de données",
            value: formatNumber(total),
            trend: `+${newLast30Days} ce mois`,
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
            value: formatNumber(totalAnalysesRun),
            trend: "",
            icon: BarChart3,
            color: "text-hff-navy",
            bgColor: "bg-hff-yellow/20",
        },
        {
            label: "Exports réalisés",
            value: formatNumber(totalExports),
            trend: "",
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
                                {loading ? "—" : item.value}
                            </p>
                            <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {item.label}
                            </p>
                            {item.trend && (
                                <p className="mt-0.5 truncate text-[10px] font-medium text-success">
                                    {loading ? "…" : item.trend}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}