import { z } from "zod";

export const projectStatusSchema = z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]);

export const projectFormSchema = z.object({
    projectName: z
        .string()
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(100, "Le nom ne doit pas dépasser 100 caractères")
        .trim(),
    description: z
        .string()
        .max(500, "La description ne doit pas dépasser 500 caractères")
        .optional()
        .or(z.literal("")),
    status: projectStatusSchema,
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;