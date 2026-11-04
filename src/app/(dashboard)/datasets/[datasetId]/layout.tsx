"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Database,
    Download,
    FileCode,
    FileJson,
    FileSpreadsheet,
    FileText,
    Loader2,
    Play,
    Share2,
    Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDataset, useDatasetColumns } from "@/hooks/use-datasets";
import { useProfiling } from "@/hooks/use-profiling";
import { CleaningDialog } from "@/components/datasets/cleaning-dialog";
import { useUIStore } from "@/stores/ui-store";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import { FILE_FORMAT_LABELS, type FileType } from "@/types/dataset";

const FORMAT_ICONS: Record<FileType, typeof FileText> = {
    CSV: FileSpreadsheet,
    XLSX: FileSpreadsheet,
    EXCEL: FileSpreadsheet,
    SQL: Database,
    JSON: FileJson,
    PNG: FileText,
    SVG: FileText,
    PDF: FileText,
    HTML: FileCode,
    ZIP: FileText,
};

const FORMAT_COLORS: Record<FileType, string> = {
    CSV: "bg-success/10 text-success ring-success/20",
    XLSX: "bg-hff-blue/10 text-hff-blue ring-hff-blue/20",
    EXCEL: "bg-hff-blue/10 text-hff-blue ring-hff-blue/20",
    SQL: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
    JSON: "bg-orange-500/10 text-orange-600 ring-orange-500/20",
    PNG: "bg-pink-500/10 text-pink-600 ring-pink-500/20",
    SVG: "bg-pink-500/10 text-pink-600 ring-pink-500/20",
    PDF: "bg-red-500/10 text-red-600 ring-red-500/20",
    HTML: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
    ZIP: "bg-muted text-muted-foreground ring-border",
};

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
    STRING: { label: "Texte", className: "bg-sky-500/10 text-sky-600 ring-sky-500/20" },
    INTEGER: {
        label: "Entier",
        className: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    },
    FLOAT: {
        label: "Décimal",
        className: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
    },
    DATE: { label: "Date", className: "bg-amber-500/10 text-amber-600 ring-amber-500/20" },
    BOOLEAN: {
        label: "Booléen",
        className: "bg-pink-500/10 text-pink-600 ring-pink-500/20",
    },
};

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ datasetId: string }>;
}

export default function DatasetLayout({ children, params }: LayoutProps) {
    const { datasetId } = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const isMaximized = useUIStore((state) => state.isDatasetMaximized);
    const [isDownloading, setIsDownloading] = useState(false);
    const [cleaningOpen, setCleaningOpen] = useState(false);

    const { data: dataset, isLoading: loadingDataset, isError } = useDataset(datasetId);
    const { data: columns, isLoading: loadingColumns } = useDatasetColumns(datasetId);
    const { data: profiles } = useProfiling(datasetId);

    const suggestionsCount =
        profiles?.reduce((acc, p) => acc + p.suggestions.length, 0) ?? 0;
    const exceptionsCount =
        profiles?.reduce((acc, p) => acc + p.exceptions.length, 0) ?? 0;

    const handleDownload = async () => {
        if (!dataset?.fileId || isDownloading) return;
        setIsDownloading(true);
        try {
            const response = await apiClient.get(`/files/${dataset.fileId}/download`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", dataset.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Téléchargement démarré");
        } catch {
            toast.error("Erreur lors du téléchargement");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Lien copié dans le presse-papiers");
        } catch {
            toast.error("Impossible de copier le lien");
        }
    };

    const handleAnalyze = () => {
        router.push(`/analyses?datasetId=${datasetId}`);
    };

    const handleOpenSuggestions = () => {
        router.push(`/datasets/${datasetId}/quality`);
    };

    if (loadingDataset) {
        return (
            <div className="flex h-[calc(100vh-7rem)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !dataset) {
        return (
            <div className="flex h-[calc(100vh-7rem)] w-full flex-col items-center justify-center gap-4">
                <p className="text-sm font-medium text-destructive">Jeu de données introuvable</p>
                <Button variant="outline" onClick={() => router.push("/datasets")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux données
                </Button>
            </div>
        );
    }

    const format = (dataset.fileFormat ?? "CSV") as FileType;
    const FormatIcon = FORMAT_ICONS[format] ?? FileText;
    const formatColor = FORMAT_COLORS[format] ?? "bg-muted text-muted-foreground ring-border";
    const formatLabel = FILE_FORMAT_LABELS[format] ?? format;

    const basePath = `/datasets/${datasetId}`;
    const tabs = [
        { label: "Vue d'ensemble", path: basePath },
        { label: "Aperçu des données", path: `${basePath}/data` },
        { label: "Qualité", path: `${basePath}/quality` },
        { label: "Utilisation", path: `${basePath}/usage` },
    ];

    const totalMissing = columns?.reduce((acc, col) => acc + col.nullCount, 0) ?? 0;
    const totalCells = (dataset.rowCount ?? 0) * (dataset.columnCount ?? 0);
    const missingPercentage = totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;
    const completionScore = 100 - missingPercentage;

    const isHealthy = completionScore >= 90;
    const isWarning = completionScore >= 70 && completionScore < 90;

    const typeCounts =
        columns?.reduce((acc, col) => {
            acc[col.detectedType] = (acc[col.detectedType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>) ?? {};

    return (
        <div className="flex h-[calc(100vh-7rem)] w-full flex-col gap-4 overflow-hidden">
            {!isMaximized && (
                <div className="flex w-full shrink-0 flex-col gap-4">
                    <Link
                        href="/datasets"
                        className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Retour aux jeux de données
                    </Link>

                    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border/50 bg-card/60 p-5 shadow-sm backdrop-blur-md xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <div
                                className={cn(
                                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner ring-1 ring-inset",
                                    formatColor
                                )}
                            >
                                <FormatIcon className="h-6 w-6" strokeWidth={2.5} />
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
                                        {dataset.datasetName}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success ring-1 ring-inset ring-success/20">
                                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                        Actif
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-foreground ring-1 ring-inset ring-border/50">
                                        {formatLabel}
                                    </span>
                                    <span>{formatNumber(dataset.rowCount)} lignes</span>
                                    <span className="text-border">•</span>
                                    <span>{formatNumber(dataset.columnCount)} colonnes</span>
                                    <span className="text-border">•</span>
                                    <span>{dataset.projectName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    className="h-9 gap-2 rounded-xl bg-background/50 text-xs"
                                    onClick={handleDownload}
                                    disabled={isDownloading || !dataset.fileId}
                                >
                                    {isDownloading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    Télécharger
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 gap-2 rounded-xl bg-background/50 text-xs"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-4 w-4" />
                                    Partager
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 gap-2 rounded-xl bg-background/50 text-xs"
                                    onClick={() => setCleaningOpen(true)}
                                >
                                    <Wand2 className="h-4 w-4" />
                                    Nettoyer
                                </Button>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "h-9 gap-2 rounded-xl bg-background/50 text-xs",
                                        suggestionsCount > 0 &&
                                        "border-hff-blue/40 bg-hff-blue/5 text-hff-blue hover:bg-hff-blue/10"
                                    )}
                                    onClick={handleOpenSuggestions}
                                    disabled={!profiles}
                                >
                                    Suggestions
                                    {suggestionsCount > 0 && (
                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-hff-blue/15 px-1.5 text-[10px] font-bold text-hff-blue">
                                            {suggestionsCount}
                                        </span>
                                    )}
                                    {exceptionsCount > 0 && (
                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-600">
                                            {exceptionsCount}
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    className="h-9 gap-2 rounded-xl bg-hff-yellow text-xs text-hff-navy shadow-sm hover:bg-hff-yellow/90"
                                    onClick={handleAnalyze}
                                >
                                    <Play className="h-4 w-4" />
                                    Analyser
                                </Button>
                            </div>

                            {!loadingColumns && columns && (
                                <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border/40 bg-background/50 px-5 py-3 shadow-sm lg:flex-nowrap">
                                    <div className="flex items-center gap-3">
                                        {isHealthy ? (
                                            <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={2} />
                                        ) : isWarning ? (
                                            <AlertCircle className="h-8 w-8 text-warning" strokeWidth={2} />
                                        ) : (
                                            <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={2} />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Complétude
                                            </span>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-xl font-bold text-foreground">
                                                    {completionScore.toFixed(1)}%
                                                </span>
                                                <span className="text-[10px] font-medium text-muted-foreground">
                                                    ({formatNumber(totalMissing)} vides)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden h-10 w-px bg-border/60 lg:block" />

                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Types détectés
                                        </span>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {Object.entries(typeCounts).map(([type, count]) => {
                                                const style =
                                                    TYPE_STYLES[type] ?? {
                                                        label: type,
                                                        className: "bg-muted text-muted-foreground ring-border",
                                                    };
                                                return (
                                                    <span
                                                        key={type}
                                                        className={cn(
                                                            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                                                            style.className
                                                        )}
                                                    >
                                                        {count} {style.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex w-full gap-1 overflow-x-auto border-b border-border/60">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.path;
                            return (
                                <Link
                                    key={tab.path}
                                    href={tab.path}
                                    className={cn(
                                        "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "border-hff-yellow font-semibold text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}

            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">{children}</div>

            <CleaningDialog
                datasetId={datasetId}
                open={cleaningOpen}
                onOpenChange={setCleaningOpen}
            />
        </div>
    );
}