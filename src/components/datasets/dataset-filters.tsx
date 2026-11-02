"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DatasetFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    projectId: string;
    onProjectChange: (value: string) => void;
    projects: { id: string; name: string }[];
    source: string;
    onSourceChange: (value: string) => void;
    sources: string[];
    onReset: () => void;
}

const SELECT_CLASSES =
    "h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm font-medium outline-none transition-all hover:border-border focus:border-hff-navy focus:ring-4 focus:ring-hff-navy/10";

export function DatasetFilters({
    searchTerm,
    onSearchChange,
    status,
    onStatusChange,
    projectId,
    onProjectChange,
    projects,
    source,
    onSourceChange,
    sources,
    onReset,
}: DatasetFiltersProps) {
    const hasFilters =
        searchTerm !== "" || status !== "all" || projectId !== "all" || source !== "all";

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                    type="search"
                    placeholder="Rechercher un jeu de données..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-11 rounded-xl pl-10"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:flex-1">
                <select
                    value={projectId}
                    onChange={(e) => onProjectChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-[180px]`}
                >
                    <option value="all">Tous les projets</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-[180px]`}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="CLEANED">Nettoyé</option>
                    <option value="EXPLORED">Exploré</option>
                    <option value="ANALYZING">En cours</option>
                    <option value="ERROR">Erreur</option>
                </select>

                <select
                    value={source}
                    onChange={(e) => onSourceChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-[180px]`}
                >
                    <option value="all">Toutes les sources</option>
                    {sources.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {hasFilters ? (
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 gap-2 rounded-xl border-hff-navy/20 text-hff-navy hover:bg-hff-navy/5"
                    onClick={onReset}
                >
                    <X className="h-4 w-4" />
                    Réinitialiser
                </Button>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 gap-2 rounded-xl"
                    disabled
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtres
                </Button>
            )}
        </div>
    );
}