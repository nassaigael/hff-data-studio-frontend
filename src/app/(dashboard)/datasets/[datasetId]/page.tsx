"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Database,
    Eye,
    FileCode,
    FileJson,
    FileSpreadsheet,
    FileText,
    HardDrive,
    Loader2,
    Pencil,
    Rows3,
    Table2,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataset, useDatasetStatistics, useDatasetColumns } from "@/hooks/use-datasets";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatNumber } from "@/lib/utils/format";
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
    CSV: "bg-success/15 text-success ring-success/30",
    XLSX: "bg-hff-blue/15 text-hff-blue ring-hff-blue/30",
    EXCEL: "bg-hff-blue/15 text-hff-blue ring-hff-blue/30",
    SQL: "bg-purple-500/15 text-purple-600 ring-purple-500/30",
    JSON: "bg-orange-500/15 text-orange-600 ring-orange-500/30",
    PNG: "bg-pink-500/15 text-pink-600 ring-pink-500/30",
    SVG: "bg-pink-500/15 text-pink-600 ring-pink-500/30",
    PDF: "bg-red-500/15 text-red-600 ring-red-500/30",
    HTML: "bg-yellow-500/15 text-yellow-600 ring-yellow-500/30",
    ZIP: "bg-muted text-muted-foreground ring-border",
};

interface PageProps {
    params: Promise<{ datasetId: string }>;
}

export default function DatasetDetailPage({ params }: PageProps) {
    const { datasetId } = use(params);
    const router = useRouter();

    const { data: dataset, isLoading, isError } = useDataset(datasetId);
    const { data: columns } = useDatasetColumns(datasetId);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !dataset) {
        return (
            <div className="flex h-[calc(100vh-7rem)] flex-col items-center justify-center gap-4">
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
    const qualityScore = dataset.qualityScore ?? 0;

    return (
        <div className="flex h-[calc(100vh-7rem)] flex-col gap-6 overflow-auto">
            <div className="flex flex-col gap-4">
                <Link
                    href="/datasets"
                    className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Retour aux jeux de données
                </Link>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
                                formatColor
                            )}
                        >
                            <FormatIcon className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{dataset.datasetName}</h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">{dataset.fileName}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset",
                                        formatColor
                                    )}
                                >
                                    {formatLabel}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                    {dataset.processingStatus === "EXPLORED"
                                        ? "Actif"
                                        : dataset.processingStatus ?? "—"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                                    {dataset.projectName}
                                </span>
                                <span className="text-muted-foreground">
                                    Mis à jour le {formatDate(dataset.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => router.push(`/datasets/${datasetId}/data`)}>
                            <Eye className="h-4 w-4" />
                            Aperçu des données
                        </Button>
                    </div>
                </div>

                <nav className="flex gap-1 border-b border-border/60">
                    <Link
                        href={`/datasets/${datasetId}`}
                        className="border-b-2 border-hff-yellow px-4 py-2 text-sm font-semibold text-foreground"
                    >
                        Vue d&apos;ensemble
                    </Link>
                    <Link
                        href={`/datasets/${datasetId}/data`}
                        className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Aperçu des données
                    </Link>
                </nav>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-foreground">Informations générales</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Nom</dt>
                            <dd className="text-right font-medium text-foreground">{dataset.datasetName}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Fichier source</dt>
                            <dd className="max-w-[60%] truncate text-right font-medium text-foreground">
                                {dataset.fileName}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Format</dt>
                            <dd className="text-right font-medium text-foreground">{formatLabel}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Lignes</dt>
                            <dd className="text-right font-medium text-foreground">
                                {formatNumber(dataset.rowCount)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Colonnes</dt>
                            <dd className="text-right font-medium text-foreground">
                                {formatNumber(dataset.columnCount)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Projet</dt>
                            <dd className="text-right font-medium text-foreground">{dataset.projectName}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Créé le</dt>
                            <dd className="text-right font-medium text-foreground">
                                {formatDate(dataset.createdAt)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Statut</dt>
                            <dd className="text-right font-medium text-foreground">
                                {dataset.isCleaned ? "Nettoyé" : "Non nettoyé"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-foreground">Qualité des données</h2>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative flex h-32 w-32 items-center justify-center">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-muted" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    strokeWidth="8"
                                    className="fill-none stroke-success transition-all duration-700"
                                    strokeDasharray={`${2 * Math.PI * 42}`}
                                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - qualityScore / 100)}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="text-2xl font-bold text-foreground">{qualityScore}%</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        {qualityScore > 0
                            ? "Score global basé sur l'exploration"
                            : "Score disponible après exploration"}
                    </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-foreground">Statistiques clés</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            icon={Rows3}
                            label="Enregistrements"
                            value={formatNumber(dataset.rowCount)}
                            color="text-hff-blue bg-hff-blue/10"
                        />
                        <StatCard
                            icon={Table2}
                            label="Colonnes"
                            value={formatNumber(dataset.columnCount)}
                            color="text-purple-600 bg-purple-500/10"
                        />
                        <StatCard
                            icon={User}
                            label="Analyses"
                            value={formatNumber(dataset.analysisCount ?? 0)}
                            color="text-success bg-success/10"
                        />
                        <StatCard
                            icon={HardDrive}
                            label="Colonnes typées"
                            value={formatNumber(columns?.length ?? 0)}
                            color="text-amber-600 bg-amber-500/10"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Actions rapides</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <Button
                        className="justify-start gap-2 rounded-xl bg-hff-yellow text-hff-navy hover:bg-hff-yellow/90"
                        onClick={() => router.push(`/datasets/${datasetId}/data`)}
                    >
                        <Eye className="h-4 w-4" />
                        Voir les données
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 rounded-xl">
                        <Pencil className="h-4 w-4" />
                        Renommer
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 rounded-xl">
                        <CheckCircle2 className="h-4 w-4" />
                        Marquer nettoyé
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 rounded-xl">
                        <Database className="h-4 w-4" />
                        Lancer une analyse
                    </Button>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: typeof Rows3;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-border/40 p-3">
            <div className={cn("mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg", color)}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold leading-tight text-foreground">{value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
        </div>
    );
}