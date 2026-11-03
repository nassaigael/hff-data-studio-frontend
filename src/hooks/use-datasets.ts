"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { datasetsApi, type GetDatasetsParams } from "@/lib/api/datasets";
import { ApiError } from "@/lib/api/errors";
import type { DatasetResponse } from "@/types/dataset";
import type { PageResponse } from "@/types/common";

export const datasetKeys = {
    all: ["datasets"] as const,
    lists: () => [...datasetKeys.all, "list"] as const,
    list: (params: GetDatasetsParams) => [...datasetKeys.lists(), params] as const,
    details: () => [...datasetKeys.all, "detail"] as const,
    detail: (id: string) => [...datasetKeys.details(), id] as const,
    columns: (id: string) => [...datasetKeys.all, "columns", id] as const,
    statistics: () => [...datasetKeys.all, "statistics"] as const,
};

const STATS_KEY = ["stats"] as const;

function invalidateAllViews(queryClient: QueryClient): void {
    queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
    queryClient.invalidateQueries({ queryKey: datasetKeys.statistics() });
    queryClient.invalidateQueries({ queryKey: STATS_KEY });
}

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
            invalidateAllViews(queryClient);
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
            invalidateAllViews(queryClient);
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
        onMutate: async ({ id, name }) => {
            await queryClient.cancelQueries({ queryKey: datasetKeys.lists() });

            const previous = queryClient.getQueriesData<PageResponse<DatasetResponse>>({
                queryKey: datasetKeys.lists(),
            });

            queryClient.setQueriesData<PageResponse<DatasetResponse>>(
                { queryKey: datasetKeys.lists() },
                (old) => {
                    if (!old?.content) return old;
                    return {
                        ...old,
                        content: old.content.map((d) =>
                            d.datasetId === id ? { ...d, datasetName: name } : d
                        ),
                    };
                }
            );

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) {
                context.previous.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            }
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
        onSuccess: () => {
            toast.success("Dataset renommé");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
        },
    });
}

export function useDeleteDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datasetId: string) => datasetsApi.deleteDataset(datasetId),
        onSuccess: () => {
            invalidateAllViews(queryClient);
            toast.success("Dataset supprimé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}