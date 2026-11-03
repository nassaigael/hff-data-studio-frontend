"use client";

import { useMemo } from "react";
import {
    Database,
    FileSpreadsheet,
    FileText,
    Upload,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import type { DatasetResponse, DatasetStatisticsResponse } from "@/types/dataset";

interface DatasetSidebarProps {
    statistics: DatasetStatisticsResponse | undefined;
    datasets?: DatasetResponse[];
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const FORMAT_STYLES: Record<string, { label: string; color: string }> = {
    EXCEL: { label: "Excel", color: "bg-hff-blue" },
    XLSX: { label: "Excel", color: "bg-hff-blue" },
    CSV: { label: "CSV", color: "bg-success" },
    SQL: { label: "SQL", color: "bg-purple-500" },
    JSON: { label: "JSON", color: "bg-orange-500" },
};

export function DatasetSidebar({ statistics, datasets = [] }: DatasetSidebarProps) {
    const total = statistics?.totalDatasets ?? 0;
    const cleaned = statistics?.cleanedDatasets ?? 0;
    const cleanedPercent = total > 0 ? (cleaned / total) * 100 : 0;
    const qualityScore = Math.round(statistics?.averageQualityScore ?? 0);
    const hasData = total > 0;

    const donutOffset = CIRCUMFERENCE - (cleanedPercent / 100) * CIRCUMFERENCE;
    const qualityOffset = CIRCUMFERENCE - (qualityScore / 100) * CIRCUMFERENCE;

    const formatBreakdown = useMemo(() => {
        if (datasets.length === 0) return [];
        const counts = new Map<string, number>();
        for (const d of datasets) {
            const key = d.fileFormat ?? "AUTRES";
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return Array.from(counts.entries())
            .map(([format, count]) => ({
                key: format,
                label: FORMAT_STYLES[format]?.label ?? "Autres",
                color: FORMAT_STYLES[format]?.color ?? "bg-muted-foreground",
                percent: Math.round((count / datasets.length) * 100),
            }))
            .sort((a, b) => b.percent - a.percent);
    }, [datasets]);

    const qualityLabel =
        qualityScore >= 80 ? "Excellent"
            : qualityScore >= 60 ? "Bon"
                : qualityScore >= 40 ? "Moyen"
                    : qualityScore > 0 ? "Faible"
                        : null;

    return (
        <div className="hff-scrollbar flex h-full flex-col gap-4 overflow-auto">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Informations sur les données
                </h3>

                {hasData ? (
                    <>
                        <div className="mb-4 flex justify-center">
                            <div className="relative h-32 w-32">
                                <svg
                                    className="-rotate-90"
                                    width="128"
                                    height="128"
                                    viewBox="0 0 100 100"
                                    fill="none"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={RADIUS}
                                        strokeWidth={10}
                                        className="stroke-muted"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={RADIUS}
                                        stroke="#1565C0"
                                        strokeWidth={10}
                                        strokeLinecap="round"
                                        strokeDasharray={CIRCUMFERENCE}
                                        strokeDashoffset={donutOffset}
                                        className="transition-all duration-700 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-foreground">
                                        {Math.round(cleanedPercent)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="mb-3 text-center text-[11px] text-muted-foreground">
                            {formatNumber(cleaned)} / {formatNumber(total)} nettoyés
                        </p>

                        {formatBreakdown.length > 0 && (
                            <div className="space-y-2">
                                {formatBreakdown.map((item) => (
                                    <LegendItem
                                        key={item.key}
                                        color={item.color}
                                        label={item.label}
                                        value={item.percent}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Database className="mb-2 h-8 w-8 text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">
                            Aucune donnée disponible
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                            Importez un fichier pour voir les statistiques
                        </p>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Qualité moyenne des données
                </h3>

                {hasData ? (
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 shrink-0">
                            <svg
                                className="-rotate-90"
                                width="80"
                                height="80"
                                viewBox="0 0 100 100"
                                fill="none"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    stroke="currentColor"
                                    strokeWidth={8}
                                    className="text-muted"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    stroke="#2E7D32"
                                    strokeWidth={8}
                                    strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={qualityOffset}
                                    className="transition-all duration-700 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-base font-bold text-foreground">
                                    {qualityScore}%
                                </span>
                            </div>
                        </div>

                        {qualityLabel && (
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-success" />
                                    <span className="text-sm font-semibold text-success">
                                        {qualityLabel}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                        Aucune donnée à évaluer
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Actions rapides
                </h3>

                <div className="space-y-1">
                    <QuickAction icon={Upload} label="Importer un fichier" />
                    <QuickAction icon={FileSpreadsheet} label="Nouvelle requête SQL" />
                    <QuickAction icon={Database} label="Créer un jeu de données" />
                    <QuickAction icon={FileText} label="Planifier un import" />
                </div>
            </div>
        </div>
    );
}

function LegendItem({
    color,
    label,
    value,
}: {
    color: string;
    label: string;
    value: number;
}) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-sm", color)} />
                <span className="font-medium text-foreground">{label}</span>
            </div>
            <span className="font-semibold text-muted-foreground">{value}%</span>
        </div>
    );
}

function QuickAction({
    icon: Icon,
    label,
}: {
    icon: typeof Upload;
    label: string;
}) {
    return (
        <button className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-hff-yellow/15 text-hff-navy transition-transform group-hover:scale-105">
                <Icon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="flex-1 text-xs font-medium text-foreground">{label}</span>
            <Zap className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
    );
}