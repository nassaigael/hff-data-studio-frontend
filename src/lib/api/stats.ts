import { apiClient } from "./client";

export interface Stats {
    totalDatasets: number;
    totalRows: number;
    totalColumns: number;
    cleanedDatasets: number;
    uncleanedDatasets: number;
    avgQualityScore: number;
    newDatasetsLast30Days: number;
    totalAnalysesRun: number;
    totalExports: number;
}

export const statsApi = {
    async get(projectId: string = "all"): Promise<Stats> {
        const response = await apiClient.get<Stats>("/stats", {
            params: { projectId },
        });
        return response.data;
    },
};