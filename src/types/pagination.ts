export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface SortingState {
    id: string;
    desc: boolean;
}

export interface FilterState {
    [key: string]: unknown;
}