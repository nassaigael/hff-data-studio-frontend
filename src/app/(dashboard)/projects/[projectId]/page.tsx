"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    BarChart3,
    Database,
    FileText,
    FolderKanban,
    Loader2,
    Upload,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectStatsGrid } from "@/components/projects/project-stats-grid";
import { ProjectEmptyTab } from "@/components/projects/project-empty-tab";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
    useProject,
    useUpdateProject,
    useArchiveProject,
    useRestoreProject,
} from "@/hooks/use-projects";
import type { ProjectFormData } from "@/lib/validators/project";

const TABS = [
    { value: "datasets", label: "Jeux de données", icon: Database },
    { value: "analyses", label: "Analyses", icon: BarChart3 },
    { value: "reports", label: "Rapports", icon: FileText },
    { value: "exports", label: "Exports", icon: Upload },
];

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;

    const { data: project, isLoading, isError } = useProject(projectId);
    const updateProject = useUpdateProject();
    const archiveProject = useArchiveProject();
    const restoreProject = useRestoreProject();

    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

    const handleFormSubmit = async (formData: ProjectFormData) => {
        if (!project) return;
        try {
            await updateProject.mutateAsync({
                id: project.projectId,
                data: {
                    projectName: formData.projectName,
                    description: formData.description || undefined,
                    status: formData.status,
                },
            });
            setFormDialogOpen(false);
        } catch {
            // Error handled by mutation
        }
    };

    const confirmArchive = async () => {
        if (!project) return;
        try {
            await archiveProject.mutateAsync(project.projectId);
            setArchiveDialogOpen(false);
        } catch {
            // Error handled by mutation
        }
    };

    const handleRestore = async () => {
        if (!project) return;
        await restoreProject.mutateAsync(project.projectId);
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-hff-navy" />
                    <p className="text-sm text-muted-foreground">Chargement du projet...</p>
                </div>
            </div>
        );
    }

    if (isError || !project) {
        return (
            <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
                <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <FolderKanban className="mx-auto h-10 w-10 text-destructive/60" />
                    <h2 className="mt-3 text-lg font-semibold text-foreground">
                        Projet introuvable
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ce projet n&apos;existe pas ou a été supprimé.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-7rem)] overflow-auto hff-scrollbar">
            <div className="space-y-6 pb-6">
                <ProjectHeader
                    project={project}
                    onEdit={() => setFormDialogOpen(true)}
                    onArchive={() => setArchiveDialogOpen(true)}
                    onRestore={handleRestore}
                />

                <ProjectStatsGrid project={project} />

                <Tabs defaultValue="datasets" className="w-full">
                    <TabsList>
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    <TabsContent value="datasets" className="mt-6">
                        <ProjectEmptyTab
                            icon={Database}
                            title="Aucun jeu de données"
                            description="Importez un fichier pour créer votre premier jeu de données dans ce projet."
                            actionLabel="Importer un fichier"
                            onAction={() => { }}
                        />
                    </TabsContent>

                    <TabsContent value="analyses" className="mt-6">
                        <ProjectEmptyTab
                            icon={BarChart3}
                            title="Aucune analyse"
                            description="Lancez votre première analyse pour explorer vos données."
                            actionLabel="Nouvelle analyse"
                            onAction={() => { }}
                        />
                    </TabsContent>

                    <TabsContent value="reports" className="mt-6">
                        <ProjectEmptyTab
                            icon={FileText}
                            title="Aucun rapport"
                            description="Générez votre premier rapport à partir d'une analyse existante."
                            actionLabel="Générer un rapport"
                            onAction={() => { }}
                        />
                    </TabsContent>

                    <TabsContent value="exports" className="mt-6">
                        <ProjectEmptyTab
                            icon={Upload}
                            title="Aucun export"
                            description="Vos exports de données et résultats apparaîtront ici."
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <ProjectFormDialog
                open={formDialogOpen}
                onOpenChange={setFormDialogOpen}
                project={project}
                isSubmitting={updateProject.isPending}
                onSubmit={handleFormSubmit}
            />

            <ConfirmDialog
                open={archiveDialogOpen}
                onOpenChange={setArchiveDialogOpen}
                title="Archiver ce projet ?"
                description={`Le projet "${project.projectName}" sera déplacé dans les archives. Vous pourrez le restaurer à tout moment.`}
                confirmLabel="Archiver"
                variant="destructive"
                isLoading={archiveProject.isPending}
                onConfirm={confirmArchive}
            />
        </div>
    );
}