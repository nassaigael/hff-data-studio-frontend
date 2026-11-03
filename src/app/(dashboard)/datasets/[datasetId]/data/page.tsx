"use client";

import { use, useMemo, useState } from "react";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Columns3,
    Database,
    Loader2,
    Maximize2,
    Minimize2,
    Pin,
    PinOff,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDatasetRows } from "@/hooks/use-dataset-rows";
import { useUIStore } from "@/stores/ui-store";
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

const PAGE_SIZE_OPTIONS = [25, 50, 100, 250];
const ROW_NUM_WIDTH = 48;
const PINNED_COL_WIDTH = 180;
const MIN_COL_WIDTH = 80;
const MAX_COL_WIDTH = 400;

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
    const isMaximized = useUIStore((state) => state.isDatasetMaximized);
    const toggleMaximized = useUIStore((state) => state.toggleDatasetMaximized);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(50);
    const [search, setSearch] = useState("");
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => new Set());
    const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(() => new Set());
    const [sort, setSort] = useState<SortState>({ column: null, direction: null });

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
                    const an = new Date(as).getTime() || 0;
                    const bn = new Date(bs).getTime() || 0;
                    return (an - bn) * dir;
                }
                case "boolean": {
                    const an = as.toLowerCase() === "true" || as.toLowerCase() === "oui" ? 1 : 0;
                    const bn = bs.toLowerCase() === "true" || bs.toLowerCase() === "oui" ? 1 : 0;
                    return (an - bn) * dir;
                }
                default: {
                    return as.localeCompare(bs, undefined, { numeric: true, sensitivity: "base" }) * dir;
                }
            }
        });
    }, [filteredRows, sort, columnKinds]);

    const handleHeaderClick = (col: string) => {
        setSort((prev) => {
            if (prev.column !== col) return { column: col, direction: "asc" };
            if (prev.direction === "asc") return { column: col, direction: "desc" };
            if (prev.direction === "desc") return { column: null, direction: null };
            return { column: col, direction: "asc" };
        });
    };

    const togglePin = (col: string) => {
        setPinnedColumns((prev) => {
            const next = new Set(prev);
            next.has(col) ? next.delete(col) : next.add(col);
            return next;
        });
    };

    const toggleColumn = (col: string) => {
        setHiddenColumns((prev) => {
            const next = new Set(prev);
            next.has(col) ? next.delete(col) : next.add(col);
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

    const getStickyLeft = (col: string): number | null => {
        const idx = stickyDataColumns.indexOf(col);
        if (idx === -1) return null;
        return ROW_NUM_WIDTH + idx * PINNED_COL_WIDTH;
    };

    if (loadingRows) {
        return (
            <div className="flex w-full flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const allColumnsHidden = visibleColumns.length === 0 && allColumns.length > 0;

    return (
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
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
                                    onClick={() => setHiddenColumns(new Set())}
                                    className="text-[10px] font-medium normal-case text-hff-blue hover:underline"
                                >
                                    Tout
                                </button>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setHiddenColumns(new Set(allColumns.slice(5)))} className="cursor-pointer text-xs">
                                Premières 5
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setHiddenColumns(new Set(allColumns.slice(10)))} className="cursor-pointer text-xs">
                                Premières 10
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
                                                    isVisible ? "border-hff-blue bg-hff-blue" : "border-border bg-transparent"
                                                )}
                                            >
                                                {isVisible && (
                                                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
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

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMaximized}
                        className="h-9 w-9 p-0 rounded-lg"
                        title={isMaximized ? "Réduire" : "Plein écran"}
                    >
                        {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {allColumnsHidden && (
                <div className="mx-4 flex shrink-0 items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        Toutes les colonnes sont masquées.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setHiddenColumns(new Set())} className="h-7 text-xs">
                        Tout afficher
                    </Button>
                </div>
            )}

            <div className="hff-scrollbar relative flex-1 overflow-auto">
                {allColumns.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                        <Database className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-foreground">Aucune donnée à afficher</p>
                    </div>
                ) : (
                    <table className="w-full min-w-max table-auto border-separate border-spacing-0 text-left">
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
                                                "sticky top-0 z-20 whitespace-nowrap border-b border-border/60 bg-muted px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
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
                                                    : { minWidth: MIN_COL_WIDTH, maxWidth: MAX_COL_WIDTH }
                                            }
                                        >
                                            <div className="group/th flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleHeaderClick(col)}
                                                    className="flex min-w-0 flex-1 items-center gap-1 truncate text-left transition-colors hover:text-foreground"
                                                >
                                                    <span className="truncate">{col}</span>
                                                    {isSorted && sort.direction === "asc" && <ArrowUpAZ className="h-3 w-3 shrink-0 text-hff-blue" />}
                                                    {isSorted && sort.direction === "desc" && <ArrowDownAZ className="h-3 w-3 shrink-0 text-hff-blue" />}
                                                    {!isSorted && <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-30" />}
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
                                                >
                                                    {isPinned ? <Pin className="h-3 w-3" fill="currentColor" /> : <PinOff className="h-3 w-3" />}
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
                                                    "whitespace-nowrap border-b border-border/40 bg-card px-3 py-2 text-xs text-foreground group-hover:bg-muted/60",
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
                                                        : { minWidth: MIN_COL_WIDTH, maxWidth: MAX_COL_WIDTH }
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
    );
}