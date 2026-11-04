import { apiClient } from "./client";

export type Severity = "INFO" | "WARNING" | "CRITICAL";

export interface SuggestionPreview {
    before: string | null;
    after: string | null;
}

export interface Suggestion {
    rule_type: string;
    confidence: number;
    severity: Severity;
    reason: string;
    affected_rows: number;
    parameters: Record<string, unknown>;
    preview: SuggestionPreview[];
}

export interface ExceptionAlert {
    severity: Severity;
    message: string;
    row_indices: number[];
}

export interface ColumnProfile {
    column_name: string;
    detected_type: string;
    health_score: number;
    suggestions: Suggestion[];
    exceptions: ExceptionAlert[];
}

export const profilingApi = {
    async get(datasetId: string): Promise<ColumnProfile[]> {
        const response = await apiClient.get<ColumnProfile[]>(`/datasets/${datasetId}/profiling`);
        return response.data;
    },
};