"use client";

import { use } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useDatasetAnalyses } from "@/hooks/use-analyses";

interface PageProps {
    params: Promise<{ datasetId: string }>;
}

const STATUS_MAP = {
    SUCCESS: { icon: CheckCircle2, color: "text-success", label: "Succès" },
    FAILED: { icon: XCircle, color: "text-destructive", label: "Échec" },
    RUNNING: { icon: Clock, color: "text-warning", label: "En cours" },
    PENDING: { icon: Clock, color: "text-muted-foreground", label: "En attente" },
};

export default function DatasetUsagePage({ params }: PageProps) {
    const { datasetId } = use(params);
    const { data, isLoading } = useDatasetAnalyses(datasetId);

    if (isLoading) {
        return (
            <div className="flex w-full flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const executions = data?.content ?? [];

    return (
        <div className="hff-scrollbar w-full flex-1 overflow-auto pr-1">
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-hff-blue" />
                        <h2 className="text-sm font-semibold text-foreground">Historique d'utilisation</h2>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {data?.totalElements ?? 0} exécutions
                    </span>
                </div>

                {executions.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                        <Activity className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-foreground">Aucune utilisation</p>
                        <p className="max-w-sm text-xs text-muted-foreground">
                            Ce jeu de données n'a pas encore été utilisé dans une analyse.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-muted/50">
                            <tr className="border-b border-border/60">
                                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Date
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Analyse
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Utilisateur
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Statut
                                </th>
                                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Durée
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {executions.map((exec) => {
                                const statusInfo = STATUS_MAP[exec.status] || STATUS_MAP.PENDING;
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <tr key={exec.executionId} className="border-b border-border/40 last:border-0 hover:bg-muted/30">
                                        <td className="px-5 py-3 text-xs text-foreground">
                                            {format(new Date(exec.executedAt), "dd MMM yyyy HH:mm", { locale: fr })}
                                        </td>
                                        <td className="px-5 py-3 text-xs font-medium text-foreground">
                                            {exec.analysisName || exec.analysisId}
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">
                                            {exec.userName || exec.userId}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${statusInfo.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                                            {exec.durationMs ? `${exec.durationMs} ms` : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}