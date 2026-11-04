"use client";

import { Fragment, useMemo, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Lightbulb,
    Loader2,
    RefreshCw,
    TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfiling, useRefreshProfiling } from "@/hooks/use-profiling";
import type { ColumnProfile, Suggestion } from "@/lib/api/profiling";
import { cn } from "@/lib/utils/cn";

interface ProfilingSuggestionsPanelProps {
    datasetId: string;
}

const RULE_LABELS: Record<string, string> = {
    TRIM: "Espaces parasites",
    NULL_IMPUTATION: "Valeurs manquantes",
    TYPE_CONVERSION: "Conversion de type",
    REGEX_CLEANING: "Nettoyage par regex",
    DUPLICATE_REMOVAL: "Doublons",
    VALUE_CONSTRAINT: "Contrainte de valeur",
};

const SEVERITY_STYLES: Record<string, string> = {
    INFO: "bg-hff-blue/10 text-hff-blue ring-hff-blue/20",
    WARNING: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    CRITICAL: "bg-destructive/10 text-destructive ring-destructive/20",
};

const scoreColor = (score: number): string => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-amber-600";
    return "text-destructive";
};

const scoreBg = (score: number): string => {
    if (score >= 90) return "bg-success";
    if (score >= 70) return "bg-amber-500";
    return "bg-destructive";
};

const confidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "text-success";
    if (confidence >= 0.7) return "text-amber-600";
    return "text-muted-foreground";
};

const ruleLabel = (ruleType: string): string =>
    RULE_LABELS[ruleType] ?? ruleType.replace(/_/g, " ").toLowerCase();

export function ProfilingSuggestionsPanel({ datasetId }: ProfilingSuggestionsPanelProps) {
    const { data, isLoading, isError, refetch } = useProfiling(datasetId);
    const refreshMutation = useRefreshProfiling(datasetId);
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

    const profiles = data ?? [];

    const totalSuggestions = useMemo(
        () => profiles.reduce((acc, p) => acc + p.suggestions.length, 0),
        [profiles]
    );

    const totalExceptions = useMemo(
        () => profiles.reduce((acc, p) => acc + p.exceptions.length, 0),
        [profiles]
    );

    const averageHealth = useMemo(() => {
        if (profiles.length === 0) return 0;
        const sum = profiles.reduce((acc, p) => acc + p.health_score, 0);
        return sum / profiles.length;
    }, [profiles]);

    const toggle = (name: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-hff-blue" />
                    <p className="text-xs text-muted-foreground">Analyse de la qualité en cours…</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-sm">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <div>
                        <p className="text-sm font-medium text-destructive">
                            Impossible de charger les suggestions
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Vérifiez que le service de qualité des données est démarré (port 8000).
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="w-fit gap-2">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Réessayer
                </Button>
            </div>
        );
    }

    if (profiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
                <Lightbulb className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">Aucune donnée à profiler</p>
                <p className="text-xs text-muted-foreground">
                    Les suggestions apparaîtront après le chargement des colonnes.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-linear-to-r from-hff-yellow/5 via-transparent to-hff-blue/5 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hff-yellow/15 ring-1 ring-inset ring-hff-yellow/30">
                        <Lightbulb className="h-5 w-5 text-hff-yellow" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Suggestions automatiques</h3>
                        <p className="truncate text-[11px] text-muted-foreground">
                            Règles proposées par le moteur de qualité, à valider avant application
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/70 px-3 py-1.5">
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold tabular-nums text-foreground">
                                {profiles.length}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Colonnes
                            </span>
                        </div>
                        <div className="h-4 w-px bg-border/60" />
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold tabular-nums text-hff-blue">
                                {totalSuggestions}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Suggestions
                            </span>
                        </div>
                        <div className="h-4 w-px bg-border/60" />
                        <div className="flex items-baseline gap-1">
                            <span
                                className={cn(
                                    "text-sm font-bold tabular-nums",
                                    totalExceptions > 0 ? "text-amber-600" : "text-muted-foreground"
                                )}
                            >
                                {totalExceptions}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Alertes
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/70 px-2.5 py-1.5">
                        <TrendingDown
                            className={cn(
                                "h-3.5 w-3.5",
                                averageHealth >= 90
                                    ? "text-success"
                                    : averageHealth >= 70
                                        ? "text-amber-600"
                                        : "text-destructive"
                            )}
                        />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Santé
                        </span>
                        <span
                            className={cn(
                                "text-xs font-bold tabular-nums",
                                averageHealth >= 90
                                    ? "text-success"
                                    : averageHealth >= 70
                                        ? "text-amber-600"
                                        : "text-destructive"
                            )}
                        >
                            {averageHealth.toFixed(0)}%
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refreshMutation.mutate()}
                        disabled={refreshMutation.isPending}
                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Actualiser"
                    >
                        <RefreshCw
                            className={cn("h-3.5 w-3.5", refreshMutation.isPending && "animate-spin")}
                        />
                    </Button>
                </div>
            </div>

            <div className="hff-scrollbar max-h-105 overflow-auto">
                <table className="w-full table-fixed">
                    <colgroup>
                        <col className="w-10" />
                        <col />
                        <col className="w-27.5" />
                        <col className="w-27.5" />
                        <col className="w-25" />
                        <col className="w-35" />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-border/60 bg-muted/60 backdrop-blur-md">
                            <th className="px-3 py-2.5" />
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Colonne
                            </th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Type
                            </th>
                            <th className="px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Suggestions
                            </th>
                            <th className="px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Alertes
                            </th>
                            <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Santé
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile) => {
                            const hasFindings =
                                profile.suggestions.length > 0 || profile.exceptions.length > 0;
                            const isExpanded = expanded.has(profile.column_name);
                            const isHealthy = profile.health_score >= 90;

                            return (
                                <Fragment key={profile.column_name}>
                                    <tr
                                        onClick={hasFindings ? () => toggle(profile.column_name) : undefined}
                                        className={cn(
                                            "border-b border-border/40 transition-colors last:border-0",
                                            hasFindings
                                                ? "cursor-pointer hover:bg-muted/40"
                                                : "cursor-default",
                                            isExpanded && "bg-hff-blue/3"
                                        )}
                                    >
                                        <td className="px-3 py-2.5 text-center">
                                            {hasFindings ? (
                                                isExpanded ? (
                                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                )
                                            ) : (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                            )}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="truncate text-xs font-semibold text-foreground">
                                                {profile.column_name}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="inline-flex items-center rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-inset ring-border/50">
                                                {profile.detected_type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {profile.suggestions.length > 0 ? (
                                                <span className="inline-flex items-center rounded-full bg-hff-blue/10 px-2 py-0.5 text-[10px] font-bold text-hff-blue ring-1 ring-inset ring-hff-blue/20">
                                                    {profile.suggestions.length}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {profile.exceptions.length > 0 ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 ring-1 ring-inset ring-amber-500/20">
                                                    {profile.exceptions.length}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted/50 sm:block">
                                                    <div
                                                        className={cn("h-full rounded-full", scoreBg(profile.health_score))}
                                                        style={{ width: `${profile.health_score}%` }}
                                                    />
                                                </div>
                                                <span
                                                    className={cn(
                                                        "w-10 text-right text-xs font-bold tabular-nums",
                                                        scoreColor(profile.health_score)
                                                    )}
                                                >
                                                    {profile.health_score.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>

                                    {isExpanded && hasFindings && (
                                        <tr className="border-b border-border/40 bg-muted/10 last:border-0">
                                            <td colSpan={6} className="px-3 py-3">
                                                <div className="flex flex-col gap-2 pl-8">
                                                    {profile.exceptions.map((ex, i) => (
                                                        <div
                                                            key={`ex-${i}`}
                                                            className={cn(
                                                                "flex items-start gap-2 rounded-lg px-2.5 py-2 text-[11px] ring-1 ring-inset",
                                                                SEVERITY_STYLES[ex.severity]
                                                            )}
                                                        >
                                                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">{ex.message}</p>
                                                                {ex.row_indices.length > 0 && (
                                                                    <p className="mt-0.5 text-[10px] opacity-80">
                                                                        Lignes concernées :{" "}
                                                                        {ex.row_indices.slice(0, 5).join(", ")}
                                                                        {ex.row_indices.length > 5 && "…"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {profile.suggestions.map((s, i) => (
                                                        <SuggestionCard key={`s-${i}`} suggestion={s} />
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
    const confidencePct = Math.round(suggestion.confidence * 100);

    return (
        <div className="rounded-lg border border-border/40 bg-background p-2.5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
                            SEVERITY_STYLES[suggestion.severity]
                        )}
                    >
                        {ruleLabel(suggestion.rule_type)}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                        {suggestion.reason}
                    </span>
                </div>
                <span
                    className={cn(
                        "shrink-0 text-[11px] font-bold tabular-nums",
                        confidenceColor(suggestion.confidence)
                    )}
                >
                    {confidencePct}%
                </span>
            </div>

            {suggestion.preview.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {suggestion.preview.slice(0, 3).map((p, i) => (
                        <span
                            key={i}
                            className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                            <span className="text-destructive/70">
                                {p.before === null ? "∅" : p.before}
                            </span>
                            <span className="mx-1 opacity-50">→</span>
                            <span className="text-success">
                                {p.after === null ? "∅" : p.after}
                            </span>
                        </span>
                    ))}
                </div>
            )}

            {suggestion.affected_rows > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <span className="inline-block h-1 w-1 rounded-full bg-hff-blue" />
                    {suggestion.affected_rows} ligne{suggestion.affected_rows > 1 ? "s" : ""} affectée
                    {suggestion.affected_rows > 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
}