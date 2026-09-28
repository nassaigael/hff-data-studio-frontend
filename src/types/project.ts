export type ProjectStatus = "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export type ProjectCategory =
    | "Ventes"
    | "Logistique"
    | "Pièces détachées"
    | "Atelier"
    | "Finance"
    | "Clients"
    | "Stratégie"
    | "Archive";

export interface ProjectResponse {
    projectId: string;
    projectName: string;
    description: string | null;
    createdAt: string;
    status: ProjectStatus;
    creatorUserId: string;
    creatorFullName: string;
    fileCount: number;
    datasetCount: number;
    analysisCount?: number;
    reportCount?: number;
    progress?: number;
    category?: ProjectCategory;
}

export interface ProjectCreationRequest {
    projectName: string;
    description?: string;
    status?: ProjectStatus;
}

export interface ProjectUpdateRequest {
    projectName: string;
    description?: string;
    status?: ProjectStatus;
}

export interface ProjectStatisticsResponse {
    totalProjects: number;
    inProgress: number;
    completed: number;
    archived: number;
    totalCreators: number;
    newProjectsLast30Days: number;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    IN_PROGRESS: "En cours",
    COMPLETED: "Terminé",
    ARCHIVED: "Archivé",
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
    "Ventes",
    "Logistique",
    "Pièces détachées",
    "Atelier",
    "Finance",
    "Clients",
    "Stratégie",
    "Archive",
];