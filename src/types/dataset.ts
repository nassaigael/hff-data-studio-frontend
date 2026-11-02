export type ColumnType = "STRING" | "INTEGER" | "FLOAT" | "DATE" | "BOOLEAN";

export type FileType =
    | "CSV"
    | "XLSX"
    | "EXCEL"
    | "PNG"
    | "SVG"
    | "PDF"
    | "HTML"
    | "ZIP"
    | "SQL"
    | "JSON";

export type FileProcessingStatus =
    | "RECEIVED"
    | "ANALYZING"
    | "EXPLORED"
    | "CLEANED"
    | "ERROR";

export interface DatasetResponse {
    datasetId: string;
    datasetName: string;
    rowCount: number;
    columnCount: number;
    createdAt: string;
    isCleaned: boolean;
    fileId: string;
    fileName: string;
    projectId: string;
    projectName: string;
    qualityScore?: number;
    analysisCount?: number;
    processingStatus?: FileProcessingStatus;
    fileFormat?: FileType;
}

export interface DatasetColumnResponse {
    columnId: string;
    originalName: string;
    normalizedName: string;
    detectedType: ColumnType;
    targetType: ColumnType;
    position: number;
    nullCount: number;
    nullPercentage: number;
    uniqueCount: number;
    uniquePercentage: number;
    cleaningRuleCount: number;
    datasetId: string;
}

export interface DatasetStatisticsResponse {
    totalDatasets: number;
    totalRows: number;
    totalColumns: number;
    cleanedDatasets: number;
    uncleanedDatasets: number;
    averageQualityScore: number;
    newDatasetsLast30Days: number;
}

export const PROCESSING_STATUS_LABELS: Record<FileProcessingStatus, string> = {
    RECEIVED: "Reçu",
    ANALYZING: "En cours",
    EXPLORED: "Exploré",
    CLEANED: "Nettoyé",
    ERROR: "Erreur",
};

export const FILE_FORMAT_LABELS: Record<FileType, string> = {
    CSV: "CSV",
    XLSX: "Excel",
    EXCEL: "Excel",
    PNG: "PNG",
    SVG: "SVG",
    PDF: "PDF",
    HTML: "HTML",
    ZIP: "ZIP",
    SQL: "SQL",
    JSON: "JSON",
};