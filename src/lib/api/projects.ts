import { apiClient } from "./client";
import type {
    ProjectCreationRequest,
    ProjectResponse,
    ProjectStatisticsResponse,
    ProjectStatus,
    ProjectUpdateRequest,
} from "@/types/project";
import type { PageResponse } from "@/types/common";

export interface GetProjectsParams {
    page?: number;
    size?: number;
    status?: ProjectStatus;
}

export const projectsApi = {
    async getAll(params: GetProjectsParams = {}): Promise<PageResponse<ProjectResponse>> {
        const { page = 0, size = 20, status } = params;
        const response = await apiClient.get<PageResponse<ProjectResponse>>("/projects", {
            params: { page, size, status },
        });
        return response.data;
    },

    async getById(projectId: string): Promise<ProjectResponse> {
        const response = await apiClient.get<ProjectResponse>(`/projects/${projectId}`);
        return response.data;
    },

    async create(data: ProjectCreationRequest): Promise<ProjectResponse> {
        const response = await apiClient.post<ProjectResponse>("/projects", data);
        return response.data;
    },

    async update(projectId: string, data: ProjectUpdateRequest): Promise<ProjectResponse> {
        const response = await apiClient.put<ProjectResponse>(`/projects/${projectId}`, data);
        return response.data;
    },

    async archive(projectId: string): Promise<void> {
        await apiClient.delete(`/projects/${projectId}`);
    },

    async restore(projectId: string): Promise<ProjectResponse> {
        const response = await apiClient.patch<ProjectResponse>(`/projects/${projectId}/restore`);
        return response.data;
    },

    async updateStatus(projectId: string, status: ProjectStatus): Promise<ProjectResponse> {
        const response = await apiClient.patch<ProjectResponse>(
            `/projects/${projectId}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    },

    async search(
        searchTerm: string,
        page = 0,
        size = 20
    ): Promise<PageResponse<ProjectResponse>> {
        const response = await apiClient.get<PageResponse<ProjectResponse>>("/projects/search", {
            params: { searchTerm, page, size },
        });
        return response.data;
    },

    async getStatistics(): Promise<ProjectStatisticsResponse> {
        const response = await apiClient.get<ProjectStatisticsResponse>("/projects/statistics");
        return response.data;
    },
};