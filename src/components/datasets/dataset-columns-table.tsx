"use client";

import { Calendar, Hash, ToggleLeft, Type } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ColumnType, DatasetColumnResponse } from "@/types/dataset";

interface TypeMeta {
    icon: typeof Type;
    label: string;
    badgeClass: string;
}

const TYPE_META: Record<ColumnType, TypeMeta> = {
    STRING: {
        icon: Type,
        label: "Texte",
        badgeClass: "bg-sky-500/15 text-sky-600 ring-sky-500/30 dark:text-sky-400",
    },
    INTEGER: {
        icon: Hash,
        label: "Entier",
        badgeClass:
            "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
    },
    FLOAT: {
        icon: Hash,
        label: "Décimal",
        badgeClass:
            "bg-violet-500/15 text-violet-600 ring-violet-500/30 dark:text-violet-400",
    },
    DATE: {
        icon: Calendar,
        label: "Date",
        badgeClass:
            "bg-amber-500/15 text-amber-600 ring-amber-500/30 dark:text-amber-400",
    },
    BOOLEAN: {
        icon: ToggleLeft,
        label: "Booléen",
        badgeClass: "bg-pink-500/15 text-pink-600 ring-pink-500/30 dark:text-pink-400",
    },
};

function TypeBadge({ type }: { type: ColumnType }) {
    const meta = TYPE_META[type];
    const Icon = meta.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                meta.badgeClass
            )}
        >
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            {meta.label}
        </span>
    );
}

interface DatasetColumnsTableProps {
    columns: DatasetColumnResponse[];
}

export function DatasetColumnsTable({ columns }: DatasetColumnsTableProps) {
    return (
        <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-md">
                <tr className="border-b border-border/60">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Nom
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Nom normalisé
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Type détecté
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Type cible
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Nulls
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Uniques
                    </th>
                </tr>
            </thead>
            <tbody>
                {columns.map((column) => {
                    const nullPct = column.nullPercentage ?? 0;

                    return (
                        <tr
                            key={column.columnId}
                            className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td className="px-5 py-3 text-xs font-medium text-muted-foreground">
                                {column.position + 1}
                            </td>
                            <td className="px-5 py-3">
                                <span className="text-sm font-semibold text-foreground">
                                    {column.originalName}
                                </span>
                            </td>
                            <td className="px-5 py-3">
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                                    {column.normalizedName}
                                </code>
                            </td>
                            <td className="px-5 py-3">
                                <TypeBadge type={column.detectedType} />
                            </td>
                            <td className="px-5 py-3">
                                <TypeBadge type={column.targetType} />
                            </td>
                            <td className="px-5 py-3 text-right">
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        nullPct > 50
                                            ? "text-destructive"
                                            : nullPct > 0
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-muted-foreground"
                                    )}
                                >
                                    {column.nullCount}
                                    {nullPct > 0 && ` (${Math.round(nullPct)}%)`}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                                <span className="text-xs font-medium text-foreground">
                                    {column.uniqueCount}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}