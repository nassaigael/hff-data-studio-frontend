export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type StatusVariant = "default" | "success" | "warning" | "error" | "info" | "neutral";