"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profilingApi, type ColumnProfile } from "@/lib/api/profiling";
import { ApiError } from "@/lib/api/errors";

export const profilingKeys = {
    all: ["profiling"] as const,
    detail: (datasetId: string) => [...profilingKeys.all, datasetId] as const,
};

export function useProfiling(datasetId: string) {
    return useQuery<ColumnProfile[]>({
        queryKey: profilingKeys.detail(datasetId),
        queryFn: () => profilingApi.get(datasetId),
        enabled: !!datasetId,
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export function useRefreshProfiling(datasetId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => profilingApi.get(datasetId),
        onSuccess: (data) => {
            queryClient.setQueryData(profilingKeys.detail(datasetId), data);
            toast.success("Profilage actualisé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}