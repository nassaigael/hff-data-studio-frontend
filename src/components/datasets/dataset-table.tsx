"use client";

import {
    Check,
    Database,
    Eye,
    FileSpreadsheet,
    FileText,
    FileJson,
    FileCode,
    MoreVertical,
    Pencil,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type {
    DatasetResponse,
    FileProcessingStatus,
    FileType,
} from "@/types/dataset";
import { PROCESSING_STATUS_LABELS } from "@/types/dataset";

interface DatasetTableProps {
    datasets: DatasetResponse[];
    selectedDatasetId?: string;
    onSelect?: (dataset: DatasetResponse) => void;
    onView?: (dataset: DatasetResponse) => void;
    onRename?: (dataset: DatasetResponse) => void;
    onMarkCleaned?: (dataset: DatasetResponse) => void;
    onMarkUncleaned?: (dataset: DatasetResponse) => void;
    onDelete?: (dataset: DatasetResponse) => void;
    minimumRows?: number;
}

const FORMAT_ICONS: Record<FileType, typeof FileText> = {
    CSV: FileSpreadsheet,
    XLSX: FileSpreadsheet,
    EXCEL: FileSpreadsheet,
    SQL: FileCode,
    JSON: FileJson,
    PNG: FileText,
    SVG: FileText,
    PDF: FileText,
    HTML: FileCode,
    ZIP: FileText,
};

const FORMAT_COLORS: Record<FileType, string> = {
    CSV: "bg-success/15 text-success",
    XLSX: "bg-hff-blue/15 text-hff-blue",
    EXCEL: "bg-hff-blue/15 text-hff-blue",
    SQL: "bg-purple-500/15 text-purple-600",
    JSON: "bg-orange-500/15 text-orange-600",
    PNG: "bg-pink-500/15 text-pink-600",
    SVG: "bg-pink-500/15 text-pink-600",
    PDF: "bg-red-500/15 text-red-600",
    HTML: "bg-yellow-500/15 text-yellow-600",
    ZIP: "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<FileProcessingStatus, string> = {
    RECEIVED: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    ANALYZING: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/20",
    EXPLORED: "bg-hff-blue/15 text-hff-blue ring-1 ring-inset ring-hff-blue/20",
    CLEANED: "bg-success/15 text-success ring-1 ring-inset ring-success/20",
    ERROR: "bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/20",
};

const STATUS_ICONS: Record<FileProcessingStatus, typeof Check> = {
    RECEIVED: Database,
    ANALYZING: Sparkles,
    EXPLORED: Eye,
    CLEANED: Check,
    ERROR: X,
};

function getStatus(dataset: DatasetResponse): FileProcessingStatus {
    if (dataset.processingStatus) return dataset.processingStatus;
    return dataset.isCleaned ? "CLEANED" : "EXPLORED";
}

function EmptyRow({ index }: { index: number }) {
    return (
        <tr
            className="border-b border-border/40 last:border-0"
            aria-hidden="true"
            data-index={index}
        >
            <td className="px-4 py-3">
                <div className="h-9 w-full max-w-[200px] rounded-xl bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="h-3 w-20 rounded bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="h-3 w-14 rounded bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="mx-auto h-3 w-14 rounded bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="mx-auto h-3 w-10 rounded bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="h-5 w-16 rounded-full bg-muted/20" />
            </td>
            <td className="px-4 py-3">
                <div className="h-3 w-20 rounded bg-muted/20" />
            </td>
            <td className="px-2 py-3">
                <div className="h-4 w-4 rounded bg-muted/20" />
            </td>
        </tr>
    );
}

export function DatasetTable({
    datasets,
    selectedDatasetId,
    onSelect,
    onView,
    onRename,
    onMarkCleaned,
    onMarkUncleaned,
    onDelete,
    minimumRows = 9,
}: DatasetTableProps) {
    const missingRows = Math.max(0, minimumRows - datasets.length);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="hff-scrollbar flex-1 overflow-auto">
                <table className="w-full table-fixed">
                    <colgroup>
                        <col className="w-[260px]" />
                        <col className="w-[140px]" />
                        <col className="w-[90px]" />
                        <col className="w-[100px]" />
                        <col className="w-[90px]" />
                        <col className="w-[120px]" />
                        <col className="w-[130px]" />
                        <col className="w-[48px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-border/60 bg-muted/60 backdrop-blur-md">
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Nom du jeu de données
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Projet
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Source
                            </th>
                            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Lignes
                            </th>
                            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Colonnes
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Statut
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Mise à jour
                            </th>
                            <th className="px-2 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {datasets.map((dataset) => {
                            const status = getStatus(dataset);
                            const StatusIcon = STATUS_ICONS[status];
                            const format = dataset.fileFormat ?? "CSV";
                            const FormatIcon = FORMAT_ICONS[format] ?? FileText;
                            const isSelected = selectedDatasetId === dataset.datasetId;

                            return (
                                <tr
                                    key={dataset.datasetId}
                                    onClick={() => onSelect?.(dataset)}
                                    className={cn(
                                        "group cursor-pointer border-b border-border/40 transition-all last:border-0",
                                        isSelected
                                            ? "bg-hff-navy/[0.04] hover:bg-hff-navy/[0.06]"
                                            : "hover:bg-muted/40"
                                    )}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div
                                                className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                                                    FORMAT_COLORS[format] ?? "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                <FormatIcon className="h-4 w-4" strokeWidth={2.5} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className="truncate text-sm font-semibold leading-tight text-foreground"
                                                    title={dataset.datasetName}
                                                >
                                                    {dataset.datasetName}
                                                </p>
                                                <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                                                    {dataset.fileName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className="truncate text-xs font-medium text-hff-blue hover:underline"
                                            title={dataset.projectName}
                                        >
                                            {dataset.projectName}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {format}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold text-foreground">
                                            {formatNumber(dataset.rowCount)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold text-foreground">
                                            {formatNumber(dataset.columnCount)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                                STATUS_STYLES[status]
                                            )}
                                        >
                                            <StatusIcon className="h-3 w-3" strokeWidth={2.5} />
                                            {PROCESSING_STATUS_LABELS[status]}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {formatDate(dataset.createdAt)}
                                        </span>
                                    </td>

                                    <td className="px-2 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                                                    aria-label="Actions"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-56"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => onView?.(dataset)}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Voir les données
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onRename?.(dataset)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Renommer
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                {status === "CLEANED" ? (
                                                    <DropdownMenuItem
                                                        onClick={() => onMarkUncleaned?.(dataset)}
                                                        className="cursor-pointer"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Marquer non nettoyé
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => onMarkCleaned?.(dataset)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Marquer nettoyé
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => onDelete?.(dataset)}
                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}

                        {Array.from({ length: missingRows }).map((_, index) => (
                            <EmptyRow key={`filler-${index}`} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}