"use client";

import { ArrowRight, ExternalLink, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import type { ProjectResponse, ProjectStatus } from "@/types/project";
import { PROJECT_STATUS_LABELS } from "@/types/project";
import { cn } from "@/lib/utils/cn";

interface ProjectPreviewSidebarProps {
    project: ProjectResponse | null;
    onClose: () => void;
}

const CATEGORY_ICON_COLORS: Record<string, string> = {
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
    IN_PROGRESS: "bg-hff-blue/15 text-hff-blue",
    COMPLETED: "bg-success/15 text-success",
    ARCHIVED: "bg-muted text-muted-foreground",
};

export function ProjectPreviewSidebar({ project, onClose }: ProjectPreviewSidebarProps) {
    const router = useRouter();

    if (!project) return null;

    const category = project.category ?? "Ventes";
    const iconColor = CATEGORY_ICON_COLORS[category] ?? "bg-muted text-muted-foreground";

    return (
        <aside className="sticky top-24 hidden w-80 shrink-0 xl:block">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        Aperçu du projet sélectionné
                    </h3>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Fermer l'aperçu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mb-4 flex items-start gap-3">
                    <div
                        className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                            iconColor
                        )}
                    >
                        <ExternalLink className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4
                            className="truncate text-sm font-bold text-foreground"
                            title={project.projectName}
                        >
                            {project.projectName}
                        </h4>
                        <span
                            className={cn(
                                "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                STATUS_STYLES[project.status]
                            )}
                        >
                            {PROJECT_STATUS_LABELS[project.status]}
                        </span>
                    </div>
                </div>

                <dl className="space-y-2.5 border-t border-border/60 pt-4 text-xs">
                    <DetailRow label="Catégorie" value={category} />
                    <DetailRow label="Créé par" value={project.creatorFullName} />
                    <DetailRow label="Date de création" value={formatDate(project.createdAt)} />
                    <DetailRow
                        label="Dernière mise à jour"
                        value={formatDateTime(project.createdAt)}
                    />
                </dl>

                {project.description && (
                    <div className="mt-4 border-t border-border/60 pt-4">
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                            Description
                        </p>
                        <p className="line-clamp-4 text-xs leading-relaxed text-foreground/80">
                            {project.description}
                        </p>
                    </div>
                )}

                <div className="mt-5 space-y-2">
                    <Button
                        onClick={() => router.push(`/projects/${project.projectId}`)}
                        className="w-full gap-2"
                    >
                        Ouvrir le projet
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/projects/${project.projectId}`)}
                        className="w-full"
                    >
                        Voir les détails
                    </Button>
                </div>
            </div>
        </aside>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd
                className="truncate text-right font-medium text-foreground"
                title={value}
            >
                {value}
            </dd>
        </div>
    );
}