"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    projectFormSchema,
    type ProjectFormData,
} from "@/lib/validators/project";
import { PROJECT_STATUS_LABELS } from "@/types/project";
import type { ProjectResponse } from "@/types/project";

interface ProjectFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: ProjectResponse | null;
    isSubmitting?: boolean;
    onSubmit: (data: ProjectFormData) => void | Promise<void>;
}

const SELECT_CLASSES =
    "h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm outline-none transition-all hover:border-border focus:border-hff-navy focus:ring-4 focus:ring-hff-navy/10 disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectFormDialog({
    open,
    onOpenChange,
    project,
    isSubmitting = false,
    onSubmit,
}: ProjectFormDialogProps) {
    const isEdit = Boolean(project);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            projectName: "",
            description: "",
            status: "IN_PROGRESS",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                projectName: project?.projectName ?? "",
                description: project?.description ?? "",
                status: project?.status ?? "IN_PROGRESS",
            });
        }
    }, [open, project, form]);

    const handleSubmit = form.handleSubmit(async (data) => {
        await onSubmit(data);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {isEdit ? "Modifier le projet" : "Nouveau projet"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Mettez à jour les informations de votre projet."
                            : "Créez un nouveau projet pour organiser vos données et analyses."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="projectName" className="text-sm font-medium">
                            Nom du projet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="projectName"
                            placeholder="Ex : Ventes & Distribution Q3 2026"
                            autoFocus
                            disabled={isSubmitting}
                            aria-invalid={!!form.formState.errors.projectName}
                            {...form.register("projectName")}
                        />
                        {form.formState.errors.projectName && (
                            <p className="text-xs font-medium text-destructive">
                                {form.formState.errors.projectName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description
                        </Label>
                        <textarea
                            id="description"
                            placeholder="Décrivez brièvement l'objectif de ce projet..."
                            rows={3}
                            disabled={isSubmitting}
                            className="w-full resize-none rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 hover:border-border focus:border-hff-navy focus:ring-4 focus:ring-hff-navy/10 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("description")}
                        />
                        {form.formState.errors.description && (
                            <p className="text-xs font-medium text-destructive">
                                {form.formState.errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">
                            Statut
                        </Label>
                        <select
                            id="status"
                            disabled={isSubmitting}
                            className={SELECT_CLASSES}
                            {...form.register("status")}
                        >
                            <option value="IN_PROGRESS">{PROJECT_STATUS_LABELS.IN_PROGRESS}</option>
                            <option value="COMPLETED">{PROJECT_STATUS_LABELS.COMPLETED}</option>
                            <option value="ARCHIVED">{PROJECT_STATUS_LABELS.ARCHIVED}</option>
                        </select>
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="rounded-xl"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="gap-2 rounded-xl bg-hff-yellow text-hff-navy hover:bg-hff-yellow/90"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? "Enregistrer" : "Créer le projet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}