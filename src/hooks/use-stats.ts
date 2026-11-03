"use client";

import { useQuery } from "@tanstack/react-query";
import { statsApi, type Stats } from "@/lib/api/stats";

export function useStats(projectId: string = "all") {
    return useQuery<Stats, Error>({
        queryKey: ["stats", projectId],
        queryFn: () => statsApi.get(projectId),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}