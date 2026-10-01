"use client";

import {
    ArrowLeft,
    Building2,
    Calendar,
    DollarSign,
    FolderKanban,
    MoreVertical,
    Package,
    Pencil,
    RotateCcw,
    Trash2,
    Users,
    Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

interface ProjectHeaderProps {
    project: ProjectResponse;
    onEdit: () => void;
    onArchive: () => void;
    onRestore: () => void;
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

export function ProjectHeader({
    project,
    onEdit,
    onArchive,
    onRestore,
}: ProjectHeaderProps) {
    const router = useRouter();
    const category = project.category ?? "Ventes";
    const Icon = CATEGORY_ICONS[category] ?? FolderKanban;
    const creatorInitials = getInitials(
        project.creatorFullName.split(" ")[0],
        project.creatorFullName.split(" ")[1]
    );
    const isArchived = project.status === "ARCHIVED";

    return (
        <div className="space-y-5">
            <button
                onClick={() => router.push("/projects")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Retour aux projets
            </button>

            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                            CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground"
                        )}
                    >
                        <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                        <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
                            {project.projectName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                        STATUS_STYLES[project.status]
                                    )}
                                >
                                    {PROJECT_STATUS_LABELS[project.status]}
                                </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <FolderKanban className="h-3.5 w-3.5" />
                                {category}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                Créé le {formatDate(project.createdAt)}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-[8px] font-bold">
                                        {creatorInitials}
                                    </AvatarFallback>
                                </Avatar>
                                {project.creatorFullName}
                            </span>
                        </div>

                        {project.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onEdit}
                        disabled={isArchived}
                        className="gap-2 rounded-xl"
                    >
                        <Pencil className="h-4 w-4" />
                        Modifier
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {isArchived ? (
                                <DropdownMenuItem onClick={onRestore} className="cursor-pointer">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restaurer le projet
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={onArchive}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Archiver le projet
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer définitivement
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}