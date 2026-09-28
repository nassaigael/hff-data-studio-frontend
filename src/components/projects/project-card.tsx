"use client";

import {
    Building2,
    DollarSign,
    MoreVertical,
    Package,
    Users,
    Wrench,
    FolderKanban,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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

interface ProjectCardProps {
    project: ProjectResponse;
    isSelected?: boolean;
    onClick?: (project: ProjectResponse) => void;
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
    Atelier: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    Finance: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    Clients: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
    Stratégie: "bg-hff-navy/10 text-hff-navy",
    Archive: "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
    IN_PROGRESS: "bg-hff-blue text-white",
    COMPLETED: "bg-success text-white",
    ARCHIVED: "bg-muted-foreground/30 text-white",
};

const PROGRESS_COLORS: Record<string, string> = {
    high: "bg-success",
    medium: "bg-hff-blue",
    low: "bg-hff-yellow",
    verylow: "bg-warning",
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

export function ProjectCard({ project, isSelected, onClick }: ProjectCardProps) {
    const category = project.category ?? "Ventes";
    const Icon = CATEGORY_ICONS[category] ?? FolderKanban;
    const progress = getProgressValue(project);
    const colorKey = getProgressColorKey(progress);
    const creatorInitials = getInitials(
        project.creatorFullName.split(" ")[0],
        project.creatorFullName.split(" ")[1]
    );

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onClick?.(project)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick?.(project);
            }}
            className={cn(
                "group relative flex w-full cursor-pointer flex-col rounded-2xl border bg-card p-5 text-left shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-hff-navy/20 hover:shadow-lg",
                isSelected
                    ? "border-hff-navy/40 shadow-lg ring-2 ring-hff-navy/10"
                    : "border-border/60"
            )}
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div
                    className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground"
                    )}
                >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                        <button
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Actions du projet"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48" onClick={handleMenuClick}>
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
            </div>

            <div className="mb-4 min-w-0">
                <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                    {project.projectName}
                </h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{category}</p>
            </div>

            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-6 w-6 ring-2 ring-background">
                        <AvatarFallback className="text-[9px] font-bold">
                            {creatorInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium leading-tight text-muted-foreground">
                            Créé par
                        </p>
                        <p className="truncate text-[11px] font-semibold leading-tight text-foreground">
                            {project.creatorFullName}
                        </p>
                    </div>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {formatDate(project.createdAt)}
                </span>
            </div>

            <div className="mb-3">
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                        STATUS_STYLES[project.status]
                    )}
                >
                    {PROJECT_STATUS_LABELS[project.status]}
                </span>
            </div>

            <div className="mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                        Progression
                    </span>
                    <span className="text-[11px] font-bold text-foreground">{progress}%</span>
                </div>
                <Progress
                    value={progress}
                    className="h-1.5"
                    indicatorClassName={PROGRESS_COLORS[colorKey]}
                />
            </div>

            <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                    {project.datasetCount ?? 0}
                </span>
                <span>Jeux de données</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="font-semibold text-foreground">
                    {project.analysisCount ?? 0}
                </span>
                <span>Analyses</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="font-semibold text-foreground">
                    {project.reportCount ?? 0}
                </span>
                <span>Rapports</span>
            </div>
        </div>
    );
}