"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { PageResponse } from "@/types/common";

export interface AnalysisExecution {
    executionId: string;
    datasetId: string;
    analysisId: string;
    analysisName: string;
    status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
    executedAt: string;
    durationMs: number;
    userId: string;
    userName: string;
}

export function useDatasetAnalyses(datasetId: string, page = 0, size = 10) {
    return useQuery({
        queryKey: ["analyses", "dataset", datasetId, page, size],
        queryFn: async () => {
            const { data } = await apiClient.get<PageResponse<AnalysisExecution>>(
                "/executions",
                { params: { datasetId, page, size } }
            );
            return data;
        },
        enabled: !!datasetId,
    });
}