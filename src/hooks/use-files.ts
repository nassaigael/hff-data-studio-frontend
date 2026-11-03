"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { filesApi, type SourceFileResponse, type UploadFileParams } from "@/lib/api/files";
import { ApiError } from "@/lib/api/errors";
import { datasetKeys } from "@/hooks/use-datasets";

export function useUploadFile() {
    const queryClient = useQueryClient();

    return useMutation<SourceFileResponse, unknown, UploadFileParams>({
        mutationFn: (params) => filesApi.upload(params),
        onSuccess: (file) => {
            queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: datasetKeys.statistics() });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Fichier importé", {
                description: `${file.fileName} a été importé avec succès.`,
            });
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, { description: apiError.description });
        },
    });
}