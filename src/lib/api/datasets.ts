import { apiClient } from "./client";
import type {
    DatasetColumnResponse,
    DatasetResponse,
    DatasetStatisticsResponse,
} from "@/types/dataset";
import type { PageResponse } from "@/types/common";

export interface GetDatasetsParams {
    page?: number;
    size?: number;
    projectId?: string;
    cleaned?: boolean;
}

export const datasetsApi = {
    async getAll(params: GetDatasetsParams = {}): Promise<PageResponse<DatasetResponse>> {
        const { page = 0, size = 20, projectId, cleaned } = params;

        const endpoint = projectId
            ? `/datasets/project/${projectId}`
            : cleaned === true
                ? "/datasets/cleaned"
                : cleaned === false
                    ? "/datasets/uncleaned"
                    : "/datasets/statistics";

        if (!projectId && cleaned === undefined) {
            const response = await apiClient.get<PageResponse<DatasetResponse>>(
                `/datasets/project/all`,
                { params: { page, size } }
            );
            return response.data;
        }

        const response = await apiClient.get<PageResponse<DatasetResponse>>(endpoint, {
            params: { page, size },
        });
        return response.data;
    },

    async getById(datasetId: string): Promise<DatasetResponse> {
        const response = await apiClient.get<DatasetResponse>(`/datasets/${datasetId}`);
        return response.data;
    },

    async getColumns(datasetId: string): Promise<DatasetColumnResponse[]> {
        const response = await apiClient.get<DatasetColumnResponse[]>(
            `/datasets/${datasetId}/columns`
        );
        return response.data;
    },

    async getByProject(
        projectId: string,
        page = 0,
        size = 20
    ): Promise<PageResponse<DatasetResponse>> {
        const response = await apiClient.get<PageResponse<DatasetResponse>>(
            `/datasets/project/${projectId}`,
            { params: { page, size } }
        );
        return response.data;
    },

    async getByFile(
        fileId: string,
        page = 0,
        size = 20
    ): Promise<PageResponse<DatasetResponse>> {
        const response = await apiClient.get<PageResponse<DatasetResponse>>(
            `/datasets/file/${fileId}`,
            { params: { page, size } }
        );
        return response.data;
    },

    async getCleaned(
        page = 0,
        size = 20
    ): Promise<PageResponse<DatasetResponse>> {
        const response = await apiClient.get<PageResponse<DatasetResponse>>(
            "/datasets/cleaned",
            { params: { page, size } }
        );
        return response.data;
    },

    async getUncleaned(
        page = 0,
        size = 20
    ): Promise<PageResponse<DatasetResponse>> {
        const response = await apiClient.get<PageResponse<DatasetResponse>>(
            "/datasets/uncleaned",
            { params: { page, size } }
        );
        return response.data;
    },

    async search(
        searchTerm: string,
        page = 0,
        size = 20
    ): Promise<PageResponse<DatasetResponse>> {
        const response = await apiClient.get<PageResponse<DatasetResponse>>(
            "/datasets/search",
            { params: { searchTerm, page, size } }
        );
        return response.data;
    },

    async getStatistics(): Promise<DatasetStatisticsResponse> {
        const response = await apiClient.get<DatasetStatisticsResponse>(
            "/datasets/statistics"
        );
        return response.data;
    },

    async markAsCleaned(datasetId: string): Promise<DatasetResponse> {
        const response = await apiClient.patch<DatasetResponse>(
            `/datasets/${datasetId}/clean`
        );
        return response.data;
    },

    async markAsUncleaned(datasetId: string): Promise<DatasetResponse> {
        const response = await apiClient.patch<DatasetResponse>(
            `/datasets/${datasetId}/unclean`
        );
        return response.data;
    },

    async renameDataset(datasetId: string, datasetName: string): Promise<DatasetResponse> {
        const response = await apiClient.patch<DatasetResponse>(
            `/datasets/${datasetId}/name`,
            null,
            { params: { datasetName } }
        );
        return response.data;
    },

    async deleteDataset(datasetId: string): Promise<void> {
        await apiClient.delete(`/datasets/${datasetId}`);
    },
};