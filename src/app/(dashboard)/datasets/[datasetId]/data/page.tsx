"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowDownAZ,
    ArrowLeft,
    ArrowUpAZ,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Columns3,
    Database,
    FileCode,
    FileJson,
    FileSpreadsheet,
    FileText,
    Loader2,
    Pin,
    PinOff,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataset } from "@/hooks/use-datasets";
import { useDatasetRows } from "@/hooks/use-dataset-rows";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const PAGE_SIZE_OPTIONS = [25, 50, 100, 250];
const ROW_NUM_WIDTH = 48;
const PINNED_COL_WIDTH = 180;
const MIN_COL_WIDTH = 150;

type SortDirection = "asc" | "desc" | null;
type ColumnKind = "number" | "date" | "boolean" | "string";

interface SortState {
    column: string | null;
    direction: SortDirection;
}

interface PageProps {
    params: Promise<{ datasetId: string }>;
}

export default function DatasetDataPage({ params }: PageProps) {
    const { datasetId } = use(params);
    const router = useRouter();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(50);
    const [search, setSearch] = useState("");
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => new Set());
    const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(() => new Set());
    const [sort, setSort] = useState<SortState>({ column: null, direction: null });

    const { data: dataset, isLoading: loadingDataset } = useDataset(datasetId);
    const { data: rowsData, isLoading: loadingRows } = useDatasetRows(datasetId, page, size);

    const allColumns = rowsData?.columns ?? [];
    const allRows = rowsData?.rows ?? [];

    const visibleColumns = useMemo(
        () => allColumns.filter((col) => !hiddenColumns.has(col)),
        [allColumns, hiddenColumns]
    );

    const stickyDataColumns = useMemo(
        () => visibleColumns.filter((col) => pinnedColumns.has(col)),
        [visibleColumns, pinnedColumns]
    );

    const columnKinds = useMemo<Record<string, ColumnKind>>(() => {
        const result: Record<string, ColumnKind> = {};
        const sampleLimit = Math.min(allRows.length, 100);

        for (const col of allColumns) {
            const values = allRows
                .slice(0, sampleLimit)
                .map((r) => r[col])
                .filter((v) => v !== null && v !== undefined && String(v).trim() !== "");

            if (values.length === 0) {
                result[col] = "string";
                continue;
            }

            const strValues = values.map((v) => String(v).trim());

            const allNumbers = strValues.every((v) => {
                const normalized = v.replace(/\s/g, "").replace(",", ".");
                return normalized !== "" && !isNaN(Number(normalized));
            });
            if (allNumbers) {
                result[col] = "number";
                continue;
            }

            const allBooleans = strValues.every((v) => {
                const l = v.toLowerCase();
                return l === "true" || l === "false" || l === "oui" || l === "non";
            });
            if (allBooleans) {
                result[col] = "boolean";
                continue;
            }

            const allDates = strValues.every((v) =>
                /^\d{4}-\d{2}-\d{2}/.test(v) || /^\d{2}\/\d{2}\/\d{4}$/.test(v)
            );
            if (allDates) {
                result[col] = "date";
                continue;
            }

            result[col] = "string";
        }

        return result;
    }, [allColumns, allRows]);

    const filteredRows = useMemo(() => {
        if (!search) return allRows;
        const term = search.toLowerCase();
        return allRows.filter((row) =>
            allColumns.some((col) => String(row[col] ?? "").toLowerCase().includes(term))
        );
    }, [allRows, allColumns, search]);

    const sortedRows = useMemo(() => {
        if (!sort.column || !sort.direction) return filteredRows;

        const col = sort.column;
        const kind = columnKinds[col] ?? "string";
        const dir = sort.direction === "asc" ? 1 : -1;

        return [...filteredRows].sort((a, b) => {
            const av = a[col];
            const bv = b[col];

            const aEmpty = av === null || av === undefined || String(av).trim() === "";
            const bEmpty = bv === null || bv === undefined || String(bv).trim() === "";
            if (aEmpty && bEmpty) return 0;
            if (aEmpty) return 1;
            if (bEmpty) return -1;

            const as = String(av).trim();
            const bs = String(bv).trim();

            switch (kind) {
                case "number": {
                    const an = Number(as.replace(/\s/g, "").replace(",", "."));
                    const bn = Number(bs.replace(/\s/g, "").replace(",", "."));
                    return (an - bn) * dir;
                }
                case "date": {
                    const an = parseDate(as);
                    const bn = parseDate(bs);
                    return (an - bn) * dir;
                }
                case "boolean": {
                    const an = boolValue(as);
                    const bn = boolValue(bs);
                    return (an - bn) * dir;
                }
                default: {
                    return as.localeCompare(bs, undefined, {
                        numeric: true,
                        sensitivity: "base",
                    }) * dir;
                }
            }
        });
    }, [filteredRows, sort, columnKinds]);

    const handleHeaderClick = (col: string) => {
        setSort((prev) => {
            if (prev.column !== col) {
                return { column: col, direction: "asc" };
            }
            if (prev.direction === "asc") {
                return { column: col, direction: "desc" };
            }
            if (prev.direction === "desc") {
                return { column: null, direction: null };
            }
            return { column: col, direction: "asc" };
        });
    };

    const togglePin = (col: string) => {
        setPinnedColumns((prev) => {
            const next = new Set(prev);
            if (next.has(col)) {
                next.delete(col);
            } else {
                next.add(col);
            }
            return next;
        });
    };

    const toggleColumn = (col: string) => {
        setHiddenColumns((prev) => {
            const next = new Set(prev);
            if (next.has(col)) {
                next.delete(col);
            } else {
                next.add(col);
            }
            return next;
        });
        if (!hiddenColumns.has(col) && pinnedColumns.has(col)) {
            setPinnedColumns((prev) => {
                const next = new Set(prev);
                next.delete(col);
                return next;
            });
        }
    };

    const showAll = () => setHiddenColumns(new Set());

    const showFirstN = (n: number) => {
        setHiddenColumns(new Set(allColumns.slice(n)));
    };

    const getStickyLeft = (col: string): number | null => {
        const idx = stickyDataColumns.indexOf(col);
        if (idx === -1) return null;
        return ROW_NUM_WIDTH + idx * PINNED_COL_WIDTH;
    };

    if (loadingDataset) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!dataset) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
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
    const allColumnsHidden = visibleColumns.length === 0 && allColumns.length > 0;

    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
            <div className="flex w-full shrink-0 flex-col gap-4">
                <Link
                    href="/datasets"
                    className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Retour aux jeux de données
                </Link>

                <div className="flex w-full items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div
                            className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                                formatColor
                            )}
                        >
                            <FormatIcon className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-bold text-foreground">
                                {dataset.datasetName}
                            </h1>
                            <p className="truncate text-xs text-muted-foreground">
                                {formatLabel} · {formatNumber(dataset.rowCount)} lignes ·{" "}
                                {formatNumber(dataset.columnCount)} colonnes · {dataset.projectName}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex w-full gap-1 overflow-x-auto border-b border-border/60">
                    <Link
                        href={`/datasets/${datasetId}`}
                        className="shrink-0 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Vue d&apos;ensemble
                    </Link>
                    <Link
                        href={`/datasets/${datasetId}/data`}
                        className="shrink-0 border-b-2 border-hff-yellow px-4 py-2 text-sm font-semibold text-foreground"
                    >
                        Aperçu des données
                    </Link>
                </nav>
            </div>

            <div className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                    <div className="relative w-full min-w-50 max-w-sm flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                            placeholder="Rechercher dans les données…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 rounded-lg pl-9"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {sort.column && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSort({ column: null, direction: null })}
                                className="h-9 gap-1 rounded-lg text-xs"
                            >
                                Effacer le tri
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg">
                                    <Columns3 className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                        {visibleColumns.length}/{allColumns.length}
                                    </span>
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="max-h-96 w-64 overflow-auto">
                                <DropdownMenuLabel className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <span>Colonnes visibles</span>
                                    <button
                                        onClick={showAll}
                                        className="text-[10px] font-medium normal-case text-hff-blue hover:underline"
                                    >
                                        Tout
                                    </button>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => showFirstN(5)} className="cursor-pointer text-xs">
                                    Premières 5
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => showFirstN(10)} className="cursor-pointer text-xs">
                                    Premières 10
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => showFirstN(20)} className="cursor-pointer text-xs">
                                    Premières 20
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {allColumns.map((col) => {
                                    const isVisible = !hiddenColumns.has(col);
                                    return (
                                        <DropdownMenuItem
                                            key={col}
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                toggleColumn(col);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex w-full items-center gap-2">
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                                        isVisible
                                                            ? "border-hff-blue bg-hff-blue"
                                                            : "border-border bg-transparent"
                                                    )}
                                                >
                                                    {isVisible && (
                                                        <svg
                                                            viewBox="0 0 12 12"
                                                            className="h-3 w-3 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                        >
                                                            <path d="M2 6l3 3 5-6" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="truncate text-xs">{col}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-2">
                            <span className="hidden text-xs text-muted-foreground sm:inline">Afficher :</span>
                            <select
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(0);
                                }}
                                className="h-9 rounded-lg border border-border/60 bg-background px-2 text-xs font-medium outline-none focus:border-hff-navy"
                            >
                                {PAGE_SIZE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt} lignes
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {allColumnsHidden && (
                    <div className="mx-4 flex shrink-0 items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Toutes les colonnes sont masquées.
                        </p>
                        <Button variant="outline" size="sm" onClick={showAll} className="h-7 text-xs">
                            Tout afficher
                        </Button>
                    </div>
                )}

                <div className="hff-scrollbar relative flex-1 overflow-auto">
                    {loadingRows ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : allColumns.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                            <Database className="h-8 w-8 text-muted-foreground/40" />
                            <p className="text-sm font-medium text-foreground">Aucune donnée à afficher</p>
                            <p className="max-w-sm text-xs text-muted-foreground">
                                L&apos;aperçu n&apos;est pas disponible pour ce format de fichier.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full min-w-max border-separate border-spacing-0 text-left">
                            <thead>
                                <tr>
                                    <th
                                        className="sticky top-0 left-0 z-30 border-b border-r border-border/60 bg-muted px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                                        style={{ width: ROW_NUM_WIDTH, minWidth: ROW_NUM_WIDTH }}
                                    >
                                        #
                                    </th>
                                    {visibleColumns.map((col) => {
                                        const isPinned = pinnedColumns.has(col);
                                        const stickyLeft = getStickyLeft(col);
                                        const isSorted = sort.column === col;
                                        const kind = columnKinds[col] ?? "string";

                                        return (
                                            <th
                                                key={col}
                                                className={cn(
                                                    "sticky top-0 z-20 border-b border-border/60 bg-muted px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                                                    isPinned && "z-30 border-r"
                                                )}
                                                style={
                                                    isPinned && stickyLeft !== null
                                                        ? {
                                                            left: stickyLeft,
                                                            width: PINNED_COL_WIDTH,
                                                            minWidth: PINNED_COL_WIDTH,
                                                            maxWidth: PINNED_COL_WIDTH,
                                                        }
                                                        : { minWidth: MIN_COL_WIDTH }
                                                }
                                            >
                                                <div className="group/th flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleHeaderClick(col)}
                                                        className="flex min-w-0 flex-1 items-center gap-1 truncate text-left transition-colors hover:text-foreground"
                                                    >
                                                        <span className="truncate">{col}</span>
                                                        <SortIcon direction={isSorted ? sort.direction : null} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            togglePin(col);
                                                        }}
                                                        className={cn(
                                                            "shrink-0 rounded p-0.5 transition-all",
                                                            isPinned
                                                                ? "text-hff-blue"
                                                                : "text-muted-foreground/40 opacity-0 hover:text-foreground group-hover/th:opacity-100"
                                                        )}
                                                        aria-label={isPinned ? "Désépingler" : "Épingler"}
                                                        title={isPinned ? "Désépingler" : "Épingler à gauche"}
                                                    >
                                                        {isPinned ? (
                                                            <Pin className="h-3 w-3" fill="currentColor" />
                                                        ) : (
                                                            <PinOff className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                                <span className="mt-0.5 block text-[9px] font-normal normal-case text-muted-foreground/60">
                                                    {kind === "number" && "nombre"}
                                                    {kind === "date" && "date"}
                                                    {kind === "boolean" && "booléen"}
                                                    {kind === "string" && "texte"}
                                                </span>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRows.map((row, idx) => (
                                    <tr key={idx} className="group">
                                        <td
                                            className="sticky left-0 z-10 border-b border-r border-border/40 bg-card px-3 py-2 text-xs font-medium text-muted-foreground group-hover:bg-muted/60"
                                            style={{ width: ROW_NUM_WIDTH, minWidth: ROW_NUM_WIDTH }}
                                        >
                                            {page * size + idx + 1}
                                        </td>
                                        {visibleColumns.map((col) => {
                                            const isPinned = pinnedColumns.has(col);
                                            const stickyLeft = getStickyLeft(col);
                                            const value = row[col];

                                            return (
                                                <td
                                                    key={col}
                                                    className={cn(
                                                        "border-b border-border/40 bg-card px-3 py-2 text-xs text-foreground group-hover:bg-muted/60",
                                                        isPinned && "sticky z-10 border-r"
                                                    )}
                                                    style={
                                                        isPinned && stickyLeft !== null
                                                            ? {
                                                                left: stickyLeft,
                                                                width: PINNED_COL_WIDTH,
                                                                minWidth: PINNED_COL_WIDTH,
                                                                maxWidth: PINNED_COL_WIDTH,
                                                            }
                                                            : { minWidth: MIN_COL_WIDTH }
                                                    }
                                                    title={value ?? ""}
                                                >
                                                    {value === null || value === undefined || value === "" ? (
                                                        <span className="italic text-muted-foreground/50">—</span>
                                                    ) : (
                                                        <span className="block truncate">{value}</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-2.5">
                    <p className="text-xs text-muted-foreground">
                        {rowsData
                            ? `Affichage de ${rowsData.totalRows === 0 ? 0 : page * size + 1} à ${Math.min(
                                (page + 1) * size,
                                rowsData.totalRows
                            )} sur ${formatNumber(rowsData.totalRows)} lignes`
                            : "Chargement…"}
                        {search && sortedRows.length !== allRows.length && (
                            <span className="ml-1 text-hff-blue">
                                · {sortedRows.length} résultat{sortedRows.length > 1 ? "s" : ""} sur cette page
                            </span>
                        )}
                        {stickyDataColumns.length > 0 && (
                            <span className="ml-1 text-muted-foreground/70">
                                · {stickyDataColumns.length} colonne{stickyDataColumns.length > 1 ? "s" : ""}{" "}
                                épinglée{stickyDataColumns.length > 1 ? "s" : ""}
                            </span>
                        )}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={!rowsData?.hasPrevious}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-2 text-xs font-semibold text-foreground">
                            {(rowsData?.pageNumber ?? 0) + 1} / {Math.max(1, rowsData?.totalPages ?? 1)}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!rowsData?.hasNext}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SortIcon({ direction }: { direction: SortDirection }) {
    if (direction === "asc") return <ArrowUpAZ className="h-3 w-3 shrink-0 text-hff-blue" />;
    if (direction === "desc") return <ArrowDownAZ className="h-3 w-3 shrink-0 text-hff-blue" />;
    return <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-30" />;
}

function parseDate(value: string): number {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return new Date(value).getTime() || 0;
    }
    const fr = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (fr) {
        return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1])).getTime();
    }
    return 0;
}

function boolValue(value: string): number {
    const v = value.toLowerCase();
    if (v === "true" || v === "oui") return 1;
    if (v === "false" || v === "non") return 0;
    return 0;
}