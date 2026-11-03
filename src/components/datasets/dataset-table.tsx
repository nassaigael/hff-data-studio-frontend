"use client";

import {
    Check,
    Database,
    Eye,
    FileCode,
    FileJson,
    FileSpreadsheet,
    FileText,
    MoreVertical,
    Pencil,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatNumber } from "@/lib/utils/format";
import {
    PROCESSING_STATUS_LABELS,
    type DatasetResponse,
    type FileProcessingStatus,
    type FileType,
} from "@/types/dataset";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const STATUS_STYLES: Record<FileProcessingStatus, string> = {
    RECEIVED: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    ANALYZING: "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    EXPLORED: "bg-hff-blue/10 text-hff-blue ring-1 ring-inset ring-hff-blue/20",
    CLEANED: "bg-success/10 text-success ring-1 ring-inset ring-success/20",
    ERROR: "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20",
};

const STATUS_ICONS: Record<FileProcessingStatus, typeof Check> = {
    RECEIVED: Database,
    ANALYZING: Sparkles,
    EXPLORED: Eye,
    CLEANED: Check,
    ERROR: X,
};

function getStatus(dataset: DatasetResponse): FileProcessingStatus {
    if (dataset.processingStatus === "ERROR") return "ERROR";
    if (dataset.processingStatus === "ANALYZING") return "ANALYZING";
    if (dataset.isCleaned) return "CLEANED";
    if (dataset.processingStatus) return dataset.processingStatus;
    return "EXPLORED";
}

function EmptyRow({ index }: { index: number }) {
    return (
        <tr className="border-b border-border/30 last:border-0" aria-hidden="true" data-index={index}>
            <td className="px-4 py-4">
                <div className="h-8 w-3/4 max-w-50 rounded-md bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="h-3 w-20 rounded bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="h-6 w-16 rounded-md bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="mx-auto h-3 w-10 rounded bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="mx-auto h-3 w-10 rounded bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="h-5 w-20 rounded-full bg-muted/30" />
            </td>
            <td className="px-4 py-4">
                <div className="h-3 w-20 rounded bg-muted/30" />
            </td>
            <td className="px-2 py-4">
                <div className="h-4 w-4 rounded bg-muted/30" />
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
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="hff-scrollbar flex-1 overflow-auto">
                <table className="w-full table-fixed text-left text-sm">
                    <colgroup>
                        <col className="w-70" />
                        <col className="w-35" />
                        <col className="w-27.5" />
                        <col className="w-20" />
                        <col className="w-20" />
                        <col className="w-30" />
                        <col className="w-30" />
                        <col className="w-12" />
                    </colgroup>
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md">
                        <tr className="border-b border-border/50">
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Jeu de données
                            </th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Projet
                            </th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Source
                            </th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Lignes
                            </th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Colonnes
                            </th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Statut
                            </th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
                                    onClick={() => {
                                        onSelect?.(dataset);
                                        onView?.(dataset);
                                    }}
                                    className={cn(
                                        "group cursor-pointer border-b border-border/30 transition-all last:border-0",
                                        isSelected ? "bg-muted/50" : "hover:bg-muted/30"
                                    )}
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform group-hover:scale-105",
                                                    FORMAT_COLORS[format] ?? "bg-muted text-muted-foreground ring-border"
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

                                    <td className="px-4 py-3.5">
                                        <span
                                            className="truncate text-xs font-medium text-hff-blue hover:underline"
                                            title={dataset.projectName}
                                        >
                                            {dataset.projectName}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset",
                                                FORMAT_COLORS[format] ?? "bg-muted text-muted-foreground ring-border"
                                            )}
                                        >
                                            {format}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 text-center">
                                        <span className="text-xs font-bold text-foreground">
                                            {formatNumber(dataset.rowCount)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 text-center">
                                        <span className="text-xs font-bold text-foreground">
                                            {formatNumber(dataset.columnCount)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                                STATUS_STYLES[status]
                                            )}
                                        >
                                            <StatusIcon className="h-3 w-3" strokeWidth={2.5} />
                                            {PROCESSING_STATUS_LABELS[status]}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {formatDate(dataset.createdAt)}
                                        </span>
                                    </td>

                                    <td className="px-2 py-3.5">
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
                                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => onView?.(dataset)}
                                                    className="cursor-pointer text-xs"
                                                >
                                                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    Voir les données
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onRename?.(dataset)}
                                                    className="cursor-pointer text-xs"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    Renommer
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                {dataset.isCleaned ? (
                                                    <DropdownMenuItem
                                                        onClick={() => onMarkUncleaned?.(dataset)}
                                                        className="cursor-pointer text-xs"
                                                    >
                                                        <X className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        Marquer non nettoyé
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => onMarkCleaned?.(dataset)}
                                                        className="cursor-pointer text-xs"
                                                    >
                                                        <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        Marquer nettoyé
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => onDelete?.(dataset)}
                                                    className="cursor-pointer text-xs text-destructive focus:text-destructive"
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