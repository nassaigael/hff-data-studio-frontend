"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRenameDataset } from "@/hooks/use-datasets";
import type { DatasetResponse } from "@/types/dataset";

interface RenameDialogProps {
    dataset: DatasetResponse | null;
    onOpenChange: (open: boolean) => void;
}

export function RenameDialog({ dataset, onOpenChange }: RenameDialogProps) {
    const [name, setName] = useState("");
    const renameMutation = useRenameDataset();

    useEffect(() => {
        if (dataset) {
            setName(dataset.datasetName);
        }
    }, [dataset]);

    const handleSubmit = () => {
        if (!dataset) return;
        const trimmed = name.trim();
        const id = dataset.datasetId;

        onOpenChange(false);

        if (!trimmed || trimmed === dataset.datasetName) {
            return;
        }

        renameMutation.mutate({ id, name: trimmed });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={!!dataset} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Renommer le jeu de données</DialogTitle>
                </DialogHeader>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nouveau nom"
                    autoFocus
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={!name.trim()}>
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}