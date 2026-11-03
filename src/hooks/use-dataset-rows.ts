"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface DatasetRows {
    columns: string[];
    rows: Record<string, string | null>[];
    totalRows: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export function useDatasetRows(datasetId: string, page: number, size: number) {
    return useQuery<DatasetRows>({
        queryKey: ["dataset-rows", datasetId, page, size],
        queryFn: async () => {
            const { data } = await apiClient.get<DatasetRows>(
                `/datasets/${datasetId}/rows`,
                { params: { page, size } }
            );
            return data;
        },
        enabled: !!datasetId,
        staleTime: 60_000,
    });
}