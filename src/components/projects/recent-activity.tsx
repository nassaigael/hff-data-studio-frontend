"use client";

import { BarChart3, Database, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ActivityItem {
    id: string;
    type: "analysis" | "dataset" | "report" | "upload";
    title: string;
    description: string;
    time: string;
}

interface RecentActivityProps {
    onClose?: () => void;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
    {
        id: "1",
        type: "analysis",
        title: "Ventes & Distribution Q2 2026",
        description: "Analyse \"Top 10 Produits\" exécutée",
        time: "Il y a 1 heure",
    },
    {
        id: "2",
        type: "dataset",
        title: "Indicateurs Financiers 2026",
        description: "Jeu de données \"Finance_Juin.xlsx\"",
        time: "Il y a 3 heures",
    },
    {
        id: "3",
        type: "report",
        title: "Atelier & Interventions",
        description: "Rapport \"Interventions_T2.pdf\"",
        time: "Il y a 5 heures",
    },
    {
        id: "4",
        type: "upload",
        title: "Ventes_Juin_2026.xlsx",
        description: "125 430 lignes importées",
        time: "Hier",
    },
];

const ACTIVITY_STYLES = {
    analysis: { icon: BarChart3, className: "bg-hff-blue/15 text-hff-blue" },
    dataset: { icon: Database, className: "bg-hff-yellow/25 text-hff-navy" },
    report: { icon: FileText, className: "bg-success/15 text-success" },
    upload: {
        icon: Upload,
        className: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    },
};

export function RecentActivity({ onClose }: RecentActivityProps) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                    Activité récente
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Masquer l'activité récente"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {MOCK_ACTIVITIES.map((activity) => {
                    const style = ACTIVITY_STYLES[activity.type];
                    const Icon = style.icon;
                    return (
                        <div key={activity.id} className="flex gap-3">
                            <div
                                className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                    style.className
                                )}
                            >
                                <Icon className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-foreground">
                                    {activity.title}
                                </p>
                                <p className="truncate text-[11px] text-muted-foreground">
                                    {activity.description}
                                </p>
                                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="mt-4 w-full text-center text-xs font-semibold text-hff-blue transition-colors hover:text-hff-navy">
                Voir toute l&apos;activité →
            </button>
        </div>
    );
}