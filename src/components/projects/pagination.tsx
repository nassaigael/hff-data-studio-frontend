"use client";

import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const showMax = 4;

    for (let i = 1; i <= Math.min(showMax, total); i++) {
        pages.push(i);
    }

    if (total > showMax + 1) {
        pages.push("...");
        pages.push(total);
    } else if (total > showMax) {
        pages.push(total);
    }

    return pages;
}

export function Pagination({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    itemLabel = "éléments",
}: PaginationProps) {
    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

    const pageNumbers = getPageNumbers(currentPage + 1, totalPages);

    return (
        <div className="flex items-center gap-3">
            <p className="hidden text-xs text-muted-foreground md:block">
                Affichage de {startIndex} à {endIndex} sur {totalElements} {itemLabel}
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNumber = page as number;
                    const isActive = pageNumber === currentPage + 1;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber - 1)}
                            className={cn(
                                "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors",
                                isActive
                                    ? "bg-hff-yellow text-hff-navy shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Page suivante"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Dernière page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}