"use client";

import { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useDatasetColumns } from "@/hooks/use-datasets";
import {
    useCleanDataset,
    useCreateCleaningRule,
    type CleaningRuleType,
} from "@/hooks/use-cleaning";
import { ApiError } from "@/lib/api/errors";

interface CleaningDialogProps {
    datasetId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface DraftRule {
    id: string;
    columnId: string;
    ruleType: CleaningRuleType;
    value: string;
}

const RULE_LABELS: Record<CleaningRuleType, string> = {
    TRIM: "Supprimer les espaces",
    NULL_IMPUTATION: "Remplacer les valeurs vides",
    TYPE_CONVERSION: "Convertir le type",
    REGEX_CLEANING: "Nettoyer par regex",
};

const requiresValue = (type: CleaningRuleType): boolean =>
    type === "NULL_IMPUTATION" ||
    type === "TYPE_CONVERSION" ||
    type === "REGEX_CLEANING";

const buildParams = (rule: DraftRule): string => {
    if (rule.ruleType === "NULL_IMPUTATION") {
        return JSON.stringify({ defaultValue: rule.value || "0" });
    }
    if (rule.ruleType === "TYPE_CONVERSION") {
        return JSON.stringify({ targetType: (rule.value || "STRING").toUpperCase() });
    }
    if (rule.ruleType === "REGEX_CLEANING") {
        return JSON.stringify({ pattern: rule.value, replacement: "" });
    }
    return "{}";
};

export function CleaningDialog({
    datasetId,
    open,
    onOpenChange,
}: CleaningDialogProps) {
    const { data: columns } = useDatasetColumns(datasetId);
    const cleanMutation = useCleanDataset(datasetId);
    const createRuleMutation = useCreateCleaningRule();

    const [drafts, setDrafts] = useState<DraftRule[]>([]);

    const availableColumns = useMemo(() => columns ?? [], [columns]);

    const addDraft = () => {
        if (availableColumns.length === 0) return;
        setDrafts((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                columnId: availableColumns[0].columnId,
                ruleType: "TRIM",
                value: "",
            },
        ]);
    };

    const removeDraft = (id: string) => {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
    };

    const updateDraft = <K extends keyof DraftRule>(
        id: string,
        key: K,
        value: DraftRule[K]
    ) => {
        setDrafts((prev) =>
            prev.map((d) => (d.id === id ? { ...d, [key]: value } : d))
        );
    };

    const reset = () => setDrafts([]);

    const handleSubmit = async () => {
        if (drafts.length === 0) return;

        try {
            await Promise.all(
                drafts.map((draft, index) =>
                    createRuleMutation.mutateAsync({
                        columnId: draft.columnId,
                        ruleType: draft.ruleType,
                        parametersJson: buildParams(draft),
                        executionOrder: index,
                        isActive: true,
                    })
                )
            );
            await cleanMutation.mutateAsync();
            reset();
            onOpenChange(false);
        } catch (error) {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        }
    };

    const isPending = cleanMutation.isPending || createRuleMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-hff-yellow" />
                        Configurer le nettoyage
                    </DialogTitle>
                    <DialogDescription>
                        Ajoutez des règles de transformation. Elles seront appliquées à
                        l&apos;ensemble des lignes puis le fichier sera réécrit.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex max-h-105 flex-col gap-3 overflow-auto py-2 pr-1">
                    {drafts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center">
                            <Wand2 className="h-8 w-8 text-muted-foreground/40" />
                            <p className="text-sm font-medium text-foreground">
                                Aucune règle définie
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Ajoutez une règle pour commencer.
                            </p>
                        </div>
                    ) : (
                        drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-3 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Colonne
                                    </label>
                                    <select
                                        value={draft.columnId}
                                        onChange={(e) =>
                                            updateDraft(draft.id, "columnId", e.target.value)
                                        }
                                        className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-xs font-medium outline-none focus:border-hff-navy"
                                    >
                                        {availableColumns.map((c) => (
                                            <option key={c.columnId} value={c.columnId}>
                                                {c.originalName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Action
                                    </label>
                                    <select
                                        value={draft.ruleType}
                                        onChange={(e) =>
                                            updateDraft(
                                                draft.id,
                                                "ruleType",
                                                e.target.value as CleaningRuleType
                                            )
                                        }
                                        className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-xs font-medium outline-none focus:border-hff-navy"
                                    >
                                        {(Object.keys(RULE_LABELS) as CleaningRuleType[]).map(
                                            (type) => (
                                                <option key={type} value={type}>
                                                    {RULE_LABELS[type]}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Valeur
                                    </label>
                                    <Input
                                        value={draft.value}
                                        onChange={(e) =>
                                            updateDraft(draft.id, "value", e.target.value)
                                        }
                                        placeholder={
                                            draft.ruleType === "TYPE_CONVERSION"
                                                ? "INTEGER, FLOAT, DATE..."
                                                : draft.ruleType === "REGEX_CLEANING"
                                                    ? "^[^a-zA-Z0-9]+"
                                                    : "0, N/A, etc."
                                        }
                                        disabled={!requiresValue(draft.ruleType)}
                                        className="h-9 text-xs"
                                    />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDraft(draft.id)}
                                    className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addDraft}
                        disabled={availableColumns.length === 0}
                        className="w-full gap-2 border-dashed"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une règle
                    </Button>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={drafts.length === 0 || isPending}
                        className="gap-2 bg-hff-yellow text-hff-navy hover:bg-hff-yellow/90"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="h-4 w-4" />
                        )}
                        Lancer le nettoyage
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}