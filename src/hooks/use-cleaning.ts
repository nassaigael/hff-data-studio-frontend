"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { datasetKeys } from "@/hooks/use-datasets";
import { profilingKeys } from "@/hooks/use-profiling";

export type CleaningRuleType =
    | "TRIM"
    | "NULL_IMPUTATION"
    | "TYPE_CONVERSION"
    | "REGEX_CLEANING";

export interface CreateCleaningRulePayload {
    columnId: string;
    ruleType: CleaningRuleType;
    parametersJson: string;
    executionOrder?: number;
    isActive?: boolean;
}

export function useCreateCleaningRule() {
    return useMutation({
        mutationFn: async (payload: CreateCleaningRulePayload) => {
            const { columnId, ...body } = payload;
            const response = await apiClient.post(`/columns/${columnId}/rules`, body);
            return response.data;
        },
    });
}

export function useCleanDataset(datasetId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.post(`/datasets/${datasetId}/cleaning/execute`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.detail(datasetId) });
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.columns(datasetId) });
            queryClient.invalidateQueries({ queryKey: ["dataset-rows", datasetId] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            queryClient.invalidateQueries({ queryKey: profilingKeys.detail(datasetId) });

            if (data.status === "COMPLETED" || data.status === "PARTIAL_SUCCESS") {
                toast.success("Nettoyage terminé", {
                    description: `${data.affectedRows ?? 0} lignes modifiées.`,
                });
            } else {
                toast.error("Le nettoyage a échoué", {
                    description: data.error ?? "Erreur inconnue",
                });
            }
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}