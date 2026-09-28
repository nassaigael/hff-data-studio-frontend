"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORIES } from "@/types/project";

interface ProjectFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    category: string;
    onCategoryChange: (value: string) => void;
    creator: string;
    onCreatorChange: (value: string) => void;
    creators: string[];
    onReset: () => void;
}

const SELECT_CLASSES =
    "h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm font-medium outline-none transition-all hover:border-border focus:border-hff-navy focus:ring-4 focus:ring-hff-navy/10";

export function ProjectFilters({
    searchTerm,
    onSearchChange,
    status,
    onStatusChange,
    category,
    onCategoryChange,
    creator,
    onCreatorChange,
    creators,
    onReset,
}: ProjectFiltersProps) {
    const hasFilters =
        searchTerm !== "" || category !== "all" || creator !== "all" || status !== "all";

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                    type="search"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-11 rounded-xl pl-10"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:flex-1">
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-45`}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminés</option>
                    <option value="ARCHIVED">Archivés</option>
                </select>

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-45`}
                >
                    <option value="all">Toutes les catégories</option>
                    {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select
                    value={creator}
                    onChange={(e) => onCreatorChange(e.target.value)}
                    className={`${SELECT_CLASSES} lg:max-w-45`}
                >
                    <option value="all">Tous les utilisateurs</option>
                    {creators.map((c) => (
                        <option key={c} value={c}>
                            {c}
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