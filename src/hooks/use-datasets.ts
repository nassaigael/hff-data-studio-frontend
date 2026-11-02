"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { datasetsApi, type GetDatasetsParams } from "@/lib/api/datasets";
import { ApiError } from "@/lib/api/errors";

export const datasetKeys = {
    all: ["datasets"] as const,
    lists: () => [...datasetKeys.all, "list"] as const,
    list: (params: GetDatasetsParams) => [...datasetKeys.lists(), params] as const,
    details: () => [...datasetKeys.all, "detail"] as const,
    detail: (id: string) => [...datasetKeys.details(), id] as const,
    columns: (id: string) => [...datasetKeys.all, "columns", id] as const,
    statistics: () => [...datasetKeys.all, "statistics"] as const,
};

export function useDatasets(params: GetDatasetsParams = {}) {
    return useQuery({
        queryKey: datasetKeys.list(params),
        queryFn: () => datasetsApi.getAll(params),
        staleTime: 60_000,
    });
}

export function useDataset(datasetId: string | null) {
    return useQuery({
        queryKey: datasetKeys.detail(datasetId ?? ""),
        queryFn: () => datasetsApi.getById(datasetId!),
        enabled: !!datasetId,
        staleTime: 60_000,
    });
}

export function useDatasetColumns(datasetId: string | null) {
    return useQuery({
        queryKey: datasetKeys.columns(datasetId ?? ""),
        queryFn: () => datasetsApi.getColumns(datasetId!),
        enabled: !!datasetId,
        staleTime: 60_000,
    });
}

export function useDatasetStatistics() {
    return useQuery({
        queryKey: datasetKeys.statistics(),
        queryFn: () => datasetsApi.getStatistics(),
        staleTime: 5 * 60_000,
    });
}

export function useMarkAsCleaned() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datasetId: string) => datasetsApi.markAsCleaned(datasetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.statistics() });
            toast.success("Dataset marqué comme nettoyé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useMarkAsUncleaned() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datasetId: string) => datasetsApi.markAsUncleaned(datasetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.statistics() });
            toast.success("Dataset marqué comme non nettoyé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useRenameDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            datasetsApi.renameDataset(id, name),
        onSuccess: (dataset) => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.detail(dataset.datasetId) });
            toast.success("Dataset renommé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useDeleteDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datasetId: string) => datasetsApi.deleteDataset(datasetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.statistics() });
            toast.success("Dataset supprimé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}