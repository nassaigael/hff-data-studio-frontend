"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projectsApi } from "@/lib/api/projects";
import { useUploadFile } from "@/hooks/use-files";
import { APP_CONFIG } from "@/lib/constants/config";
import { cn } from "@/lib/utils/cn";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultProjectId?: string;
}

export function UploadDialog({ open, onOpenChange, defaultProjectId }: UploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [projectId, setProjectId] = useState(defaultProjectId ?? "");
    const [progress, setProgress] = useState(0);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = useUploadFile();
    const { data: projectsPage, isLoading: loadingProjects } = useQuery({
        queryKey: ["projects", "all-for-upload"],
        queryFn: () => projectsApi.getAll({ size: 100 }),
        enabled: open,
        staleTime: 60_000,
    });

    const projects = projectsPage?.content ?? [];

    useEffect(() => {
        if (!open) {
            setFile(null);
            setProgress(0);
            setLocalError(null);
            setProjectId(defaultProjectId ?? "");
            uploadMutation.reset();
        }
    }, [open, defaultProjectId]);

    useEffect(() => {
        if (!projectId && projects.length > 0) {
            setProjectId(projects[0].projectId);
        }
    }, [projects, projectId]);

    const validateFile = useCallback((f: File): string | null => {
        if (f.size > APP_CONFIG.upload.maxFileSize) {
            const maxMb = Math.round(APP_CONFIG.upload.maxFileSize / (1024 * 1024));
            return `Fichier trop volumineux (max ${maxMb} MB).`;
        }
        const lower = f.name.toLowerCase();
        const ok = APP_CONFIG.upload.acceptedExtensions.some((ext) => lower.endsWith(ext));
        if (!ok) {
            return `Format non supporté. Extensions acceptées : ${APP_CONFIG.upload.acceptedExtensions.join(", ")}.`;
        }
        return null;
    }, []);

    const handleFile = useCallback(
        (f: File | null) => {
            setLocalError(null);
            if (!f) {
                setFile(null);
                return;
            }
            const err = validateFile(f);
            if (err) {
                setLocalError(err);
                setFile(null);
                return;
            }
            setFile(f);
        },
        [validateFile]
    );

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file || !projectId) return;
        setProgress(0);
        try {
            await uploadMutation.mutateAsync({
                file,
                projectId,
                onProgress: setProgress,
            });
            onOpenChange(false);
        } catch {
            setProgress(0);
        }
    };

    const disableSubmit = !file || !projectId || uploadMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Importer des données</DialogTitle>
                    <DialogDescription>
                        Ajoutez un fichier CSV, Excel, JSON ou SQL à un projet.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Projet de destination
                        </label>
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            disabled={loadingProjects || projects.length === 0}
                            className="h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm font-medium outline-none focus:border-hff-navy focus:ring-4 focus:ring-hff-navy/10 disabled:opacity-50"
                        >
                            {loadingProjects && <option>Chargement…</option>}
                            {!loadingProjects && projects.length === 0 && (
                                <option value="">Aucun projet disponible</option>
                            )}
                            {projects.map((p) => (
                                <option key={p.projectId} value={p.projectId}>
                                    {p.projectName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Fichier
                        </label>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={cn(
                                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                                isDragging
                                    ? "border-hff-navy bg-hff-navy/5"
                                    : "border-border/60 hover:border-border",
                                file && "bg-muted/30"
                            )}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept={APP_CONFIG.upload.acceptedExtensions.join(",")}
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                            />
                            {file ? (
                                <>
                                    <FileSpreadsheet className="h-8 w-8 text-success" />
                                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} Ko
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFile(null);
                                        }}
                                        className="mt-1 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                                    >
                                        <X className="h-3 w-3" /> Retirer
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-muted-foreground/60" />
                                    <p className="text-sm font-medium text-foreground">
                                        Glissez un fichier ici ou cliquez pour parcourir
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        CSV, XLSX, XLS, JSON, SQL — max 200 MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {localError && (
                        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{localError}</p>
                        </div>
                    )}

                    {uploadMutation.isPending && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Upload en cours…</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-hff-navy transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={uploadMutation.isPending}
                    >
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={disableSubmit} className="gap-2">
                        {uploadMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" /> Importer
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}