"use client";

import { use } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    Database,
    FileSpreadsheet,
    HardDrive,
    Table2,
    User,
} from "lucide-react";
import { useDataset, useDatasetColumns } from "@/hooks/use-datasets";
import { useDatasetRows } from "@/hooks/use-dataset-rows";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatNumber } from "@/lib/utils/format";

interface PageProps {
    params: Promise<{ datasetId: string }>;
}

const TYPE_COLORS: Record<string, string> = {
    STRING: "bg-sky-500",
    INTEGER: "bg-emerald-500",
    FLOAT: "bg-violet-500",
    DATE: "bg-amber-500",
    BOOLEAN: "bg-pink-500",
};

const TYPE_LABELS: Record<string, string> = {
    STRING: "Texte",
    INTEGER: "Entier",
    FLOAT: "Décimal",
    DATE: "Date",
    BOOLEAN: "Booléen",
};

export default function DatasetDetailPage({ params }: PageProps) {
    const { datasetId } = use(params);
    const { data: dataset } = useDataset(datasetId);
    const { data: columns } = useDatasetColumns(datasetId);
    const { data: rowsData } = useDatasetRows(datasetId, 0, 5);

    if (!dataset) return null;

    const totalMissing = columns?.reduce((acc, col) => acc + col.nullCount, 0) ?? 0;
    const totalCells = (dataset.rowCount ?? 0) * (dataset.columnCount ?? 0);
    const completionScore = totalCells > 0 ? 100 - (totalMissing / totalCells) * 100 : 100;
    const isHealthy = completionScore >= 90;

    const typeCounts = columns?.reduce((acc, col) => {
        acc[col.detectedType] = (acc[col.detectedType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) ?? {};

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex h-full w-full flex-col gap-5 overflow-hidden bg-background">

            <div className="flex shrink-0 flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 ring-1 ring-inset ring-border/50">
                    <Calendar className="h-3.5 w-3.5" />
                    Créé le {formatDate(dataset.createdAt)}
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 ring-1 ring-inset ring-border/50">
                    <Clock className="h-3.5 w-3.5" />
                    Mise à jour {formatDate(dataset.createdAt)}
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 ring-1 ring-inset ring-border/50">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Type {dataset.fileFormat}
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 ring-1 ring-inset ring-border/50">
                    <HardDrive className="h-3.5 w-3.5" />
                    Taille Inconnue
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 ring-1 ring-inset ring-border/50">
                    <User className="h-3.5 w-3.5" />
                    {dataset.projectName}
                </div>
            </div>

            <div className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hff-blue/10 text-hff-blue">
                                <Table2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-medium text-muted-foreground">Nombre total de lignes</span>
                                <span className="text-2xl font-bold text-foreground">{formatNumber(dataset.rowCount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                                <Database className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-medium text-muted-foreground">Nombre de colonnes</span>
                                <span className="text-2xl font-bold text-foreground">{formatNumber(dataset.columnCount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-medium text-muted-foreground">Complétude</span>
                                <span className="text-2xl font-bold text-foreground">{completionScore.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-medium text-muted-foreground">Dernière mise à jour</span>
                                <span className="text-sm font-bold text-foreground">{formatDate(dataset.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-3">

                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm lg:col-span-2">
                    <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Table2 className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-semibold text-foreground">Aperçu des données</h2>
                        </div>
                        <Link
                            href={`/datasets/${datasetId}/data`}
                            className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-muted"
                        >
                            Voir l'intégralité
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="hff-scrollbar flex-1 overflow-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-muted/30 backdrop-blur-md">
                                <tr className="border-b border-border/50">
                                    {rowsData?.columns.slice(0, 5).map((col) => (
                                        <th key={col} className="whitespace-nowrap px-4 py-2.5 font-semibold text-muted-foreground">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rowsData?.rows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                                        {rowsData.columns.slice(0, 5).map((col) => (
                                            <td key={col} className="max-w-[150px] truncate whitespace-nowrap px-4 py-2.5 text-foreground">
                                                {row[col] === null || row[col] === undefined || row[col] === "" ? (
                                                    <span className="text-muted-foreground/50">—</span>
                                                ) : (
                                                    String(row[col])
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex h-full min-h-0 flex-col gap-5">

                    <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-semibold text-foreground">Types de données</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(typeCounts).length === 0 ? (
                                <span className="text-xs text-muted-foreground">Aucun type détecté.</span>
                            ) : (
                                Object.entries(typeCounts).map(([type, count]) => (
                                    <div key={type} className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/20 px-2 py-1">
                                        <span className={cn("h-2 w-2 rounded-full", TYPE_COLORS[type] || "bg-muted-foreground")} />
                                        <span className="text-xs font-bold text-foreground">{count}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground">{TYPE_LABELS[type] || type}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                        <div className="mb-4 flex w-full items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <h2 className="text-sm font-semibold text-foreground">Qualité des données</h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
                                    <circle cx="48" cy="48" r={radius} className="fill-none stroke-muted/30" strokeWidth="8" />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r={radius}
                                        className={cn("fill-none transition-all duration-1000", isHealthy ? "stroke-success" : "stroke-warning")}
                                        strokeWidth="8"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={circumference - (completionScore / 100) * circumference}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-xl font-bold text-foreground">{completionScore.toFixed(0)}%</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-medium text-muted-foreground">Score global</span>
                                    <span className="text-xs font-bold text-foreground">{completionScore.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-medium text-muted-foreground">Manquantes</span>
                                    <span className="text-xs font-bold text-foreground">{formatNumber(totalMissing)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}