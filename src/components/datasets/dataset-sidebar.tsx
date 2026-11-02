"use client";

import {
    Database,
    Download,
    FileSpreadsheet,
    FileText,
    HardDrive,
    Upload,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import type { DatasetStatisticsResponse } from "@/types/dataset";

interface DatasetSidebarProps {
    statistics: DatasetStatisticsResponse | undefined;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DatasetSidebar({ statistics }: DatasetSidebarProps) {
    const qualityScore = Math.round(statistics?.averageQualityScore ?? 78);
    const storagePercent = 62;
    const storageUsed = "24,8 Go";
    const storageTotal = "40 Go";

    const offset = CIRCUMFERENCE - (qualityScore / 100) * CIRCUMFERENCE;

    const total = statistics?.totalDatasets ?? 0;
    const cleaned = statistics?.cleanedDatasets ?? 0;
    const cleanedPercent = total > 0 ? (cleaned / total) * 100 : 0;

    const donutOffset = CIRCUMFERENCE - (cleanedPercent / 100) * CIRCUMFERENCE;

    return (
        <div className="hff-scrollbar flex h-full flex-col gap-4 overflow-auto">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Informations sur les données
                </h3>

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
                                stroke="rgba(255,255,255,0.06)"
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
                            <circle
                                cx="50"
                                cy="50"
                                r={RADIUS}
                                stroke="#2E7D32"
                                strokeWidth={10}
                                strokeLinecap="round"
                                strokeDasharray={`${CIRCUMFERENCE * 0.25} ${CIRCUMFERENCE * 0.75}`}
                                strokeDashoffset={-CIRCUMFERENCE * 0.75}
                                className="transition-all duration-700 ease-out"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={RADIUS}
                                stroke="#FFCD11"
                                strokeWidth={10}
                                strokeLinecap="round"
                                strokeDasharray={`${CIRCUMFERENCE * 0.2} ${CIRCUMFERENCE * 0.8}`}
                                strokeDashoffset={-CIRCUMFERENCE * 0.5}
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

                <div className="space-y-2">
                    <LegendItem color="bg-hff-blue" label="Excel" value={45} />
                    <LegendItem color="bg-success" label="CSV" value={25} />
                    <LegendItem color="bg-purple-500" label="SQL" value={20} />
                    <LegendItem color="bg-muted-foreground" label="Autres" value={10} />
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Qualité moyenne des données
                </h3>

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
                                strokeDashoffset={offset}
                                className="transition-all duration-700 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-bold text-foreground">
                                {qualityScore}%
                            </span>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            <span className="text-sm font-semibold text-success">Bon</span>
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-success">
                            +6% ce mois
                        </p>
                    </div>
                </div>
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

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-hff-yellow" />
                    <h3 className="text-sm font-semibold text-foreground">
                        Espace de stockage
                    </h3>
                </div>

                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                        {storageUsed} / {storageTotal}
                    </span>
                    <span className="font-semibold text-hff-navy">{storagePercent}%</span>
                </div>

                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-hff-yellow to-hff-yellow/70 transition-all duration-500"
                        style={{ width: `${storagePercent}%` }}
                    />
                </div>

                <button className="mt-3 text-xs font-semibold text-hff-blue transition-colors hover:text-hff-navy">
                    Gérer le stockage →
                </button>
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