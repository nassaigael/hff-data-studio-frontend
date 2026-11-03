"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDataset } from "@/hooks/use-datasets";
import type { DatasetResponse } from "@/types/dataset";

interface DeleteConfirmDialogProps {
    dataset: DatasetResponse | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({ dataset, onOpenChange }: DeleteConfirmDialogProps) {
    const deleteMutation = useDeleteDataset();

    const handleConfirm = async () => {
        if (!dataset) return;
        await deleteMutation.mutateAsync(dataset.datasetId);
        onOpenChange(false);
    };

    return (
        <Dialog open={!!dataset} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Supprimer le jeu de données</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer « {dataset?.datasetName} » ? Cette
                        action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Suppression…" : "Supprimer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}