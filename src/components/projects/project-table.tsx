"use client";

import {
    Building2,
    DollarSign,
    FolderKanban,
    MoreVertical,
    Package,
    Users,
    Wrench,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ProjectResponse, ProjectStatus } from "@/types/project";
import { PROJECT_STATUS_LABELS } from "@/types/project";

interface ProjectTableProps {
    projects: ProjectResponse[];
    selectedProjectId?: string;
    onSelect?: (project: ProjectResponse) => void;
}

const CATEGORY_ICONS: Record<string, typeof FolderKanban> = {
    Ventes: DollarSign,
    Logistique: Package,
    "Pièces détachées": Wrench,
    Atelier: Wrench,
    Finance: Building2,
    Clients: Users,
    Stratégie: FolderKanban,
    Archive: FolderKanban,
};

const CATEGORY_COLORS: Record<string, string> = {
    Ventes: "bg-hff-blue/15 text-hff-blue",
    Logistique: "bg-success/15 text-success",
    "Pièces détachées": "bg-hff-yellow/25 text-hff-navy",
    Atelier: "bg-purple-500/15 text-purple-600",
    Finance: "bg-orange-500/15 text-orange-600",
    Clients: "bg-teal-500/15 text-teal-600",
    Stratégie: "bg-hff-navy/10 text-hff-navy",
    Archive: "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
    IN_PROGRESS: "bg-hff-blue/15 text-hff-blue ring-1 ring-inset ring-hff-blue/20",
    COMPLETED: "bg-success/15 text-success ring-1 ring-inset ring-success/20",
    ARCHIVED: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
};

const PROGRESS_TEXT_COLORS: Record<string, string> = {
    high: "text-success",
    medium: "text-hff-blue",
    low: "text-hff-navy",
    verylow: "text-warning",
};

function getProgressValue(project: ProjectResponse): number {
    if (project.progress !== undefined) return project.progress;
    if (project.status === "COMPLETED" || project.status === "ARCHIVED") return 100;
    const seed = project.projectId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (seed % 50) + 30;
}

function getProgressColorKey(progress: number): string {
    if (progress >= 90) return "high";
    if (progress >= 60) return "medium";
    if (progress >= 30) return "low";
    return "verylow";
}

export function ProjectTable({ projects, selectedProjectId, onSelect }: ProjectTableProps) {
    const isEmpty = projects.length === 0;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="hff-scrollbar flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-border/60 bg-muted/60 backdrop-blur-md">
                            <th className="w-70 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Projet
                            </th>
                            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Créé par
                            </th>
                            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Date
                            </th>
                            <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Progression
                            </th>
                            <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Données
                            </th>
                            <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Analyses
                            </th>
                            <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Rapports
                            </th>
                            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Statut
                            </th>
                            <th className="w-14 px-3 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {isEmpty ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <tr
                                    key={`empty-${index}`}
                                    className="border-b border-border/40 last:border-0"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/40" />
                                            <div className="h-3 w-32 rounded bg-muted/40" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-3 w-24 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-3 w-16 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="mx-auto h-3 w-10 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="mx-auto h-3 w-6 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="mx-auto h-3 w-6 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="mx-auto h-3 w-6 rounded bg-muted/40" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-5 w-16 rounded-full bg-muted/40" />
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="h-4 w-4 rounded bg-muted/40" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            projects.map((project) => {
                                const category = project.category ?? "Ventes";
                                const Icon = CATEGORY_ICONS[category] ?? FolderKanban;
                                const progress = getProgressValue(project);
                                const colorKey = getProgressColorKey(progress);
                                const creatorInitials = getInitials(
                                    project.creatorFullName.split(" ")[0],
                                    project.creatorFullName.split(" ")[1]
                                );
                                const isSelected = selectedProjectId === project.projectId;

                                return (
                                    <tr
                                        key={project.projectId}
                                        onClick={() => onSelect?.(project)}
                                        className={cn(
                                            "group cursor-pointer border-b border-border/40 transition-all last:border-0",
                                            isSelected
                                                ? "bg-hff-navy/4 hover:bg-hff-navy/6]"
                                                : "hover:bg-muted/40"
                                        )}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                                                        CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground"
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" strokeWidth={2} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold leading-tight text-foreground">
                                                        {project.projectName}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                                                        {category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <Avatar className="h-7 w-7 ring-2 ring-background">
                                                    <AvatarFallback className="text-[10px] font-bold">
                                                        {creatorInitials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate text-xs font-medium text-foreground">
                                                    {project.creatorFullName}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {formatDate(project.createdAt)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <span className={cn("text-sm font-bold", PROGRESS_TEXT_COLORS[colorKey])}>
                                                {progress}%
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <span className="text-sm font-semibold text-foreground">
                                                {project.datasetCount ?? 0}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <span className="text-sm font-semibold text-foreground">
                                                {project.analysisCount ?? 0}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <span className="text-sm font-semibold text-foreground">
                                                {project.reportCount ?? 0}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                                    STATUS_STYLES[project.status]
                                                )}
                                            >
                                                {PROJECT_STATUS_LABELS[project.status]}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
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
                                                    className="w-48"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <DropdownMenuItem>Ouvrir le projet</DropdownMenuItem>
                                                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Changer le statut</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        Archiver
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}