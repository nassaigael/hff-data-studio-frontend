"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi, type GetProjectsParams } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import type {
    ProjectCreationRequest,
    ProjectStatus,
    ProjectUpdateRequest,
} from "@/types/project";

export const projectKeys = {
    all: ["projects"] as const,
    lists: () => [...projectKeys.all, "list"] as const,
    list: (params: GetProjectsParams) => [...projectKeys.lists(), params] as const,
    details: () => [...projectKeys.all, "detail"] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
    statistics: () => [...projectKeys.all, "statistics"] as const,
};

export function useProjects(params: GetProjectsParams = {}) {
    return useQuery({
        queryKey: projectKeys.list(params),
        queryFn: () => projectsApi.getAll(params),
        staleTime: 60_000,
    });
}

export function useProject(projectId: string | null) {
    return useQuery({
        queryKey: projectKeys.detail(projectId ?? ""),
        queryFn: () => projectsApi.getById(projectId!),
        enabled: !!projectId,
        staleTime: 60_000,
    });
}

export function useProjectStatistics() {
    return useQuery({
        queryKey: projectKeys.statistics(),
        queryFn: () => projectsApi.getStatistics(),
        staleTime: 5 * 60_000,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProjectCreationRequest) => projectsApi.create(data),
        onSuccess: (project) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.statistics() });
            toast.success("Projet créé", {
                description: `${project.projectName} a été créé avec succès.`,
            });
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProjectUpdateRequest }) =>
            projectsApi.update(id, data),
        onSuccess: (project) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(project.projectId) });
            toast.success("Projet mis à jour");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useArchiveProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) => projectsApi.archive(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.statistics() });
            toast.success("Projet archivé");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useRestoreProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) => projectsApi.restore(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.statistics() });
            toast.success("Projet restauré");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}

export function useUpdateProjectStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
            projectsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            toast.success("Statut mis à jour");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}