import { apiClient } from "./client";

export interface SourceFileResponse {
    fileId: string;
    fileName: string;
    fileType: string;
    sizeBytes: number;
    uploadedAt: string;
    processingStatus: string;
    projectId: string;
    userId: string;
    storagePath: string;
}

export interface UploadFileParams {
    file: File;
    projectId: string;
    fileType?: string;
    onProgress?: (percent: number) => void;
}

export const filesApi = {
    async upload({ file, projectId, fileType, onProgress }: UploadFileParams): Promise<SourceFileResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        if (fileType) {
            formData.append("fileType", fileType);
        }

        const response = await apiClient.post<SourceFileResponse>("/files/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 300_000,
            onUploadProgress: (event) => {
                if (onProgress && event.total) {
                    onProgress(Math.round((event.loaded / event.total) * 100));
                }
            },
        });
        return response.data;
    },
};