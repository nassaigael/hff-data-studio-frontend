export interface ApiErrorResponse {
    code?: string;
    message: string;
    details?: string;
    status?: number;
    path?: string;
    method?: string;
    timestamp?: string;
    validationErrors?: Record<string, string>;
}

export class ApiError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: string;
    public readonly validationErrors?: Record<string, string>;

    constructor(response: ApiErrorResponse) {
        super(response.message);
        this.name = "ApiError";
        this.code = response.code ?? "UNKNOWN_ERROR";
        this.status = response.status ?? 500;
        this.details = response.details;
        this.validationErrors = response.validationErrors;
    }

    static from(error: unknown): ApiError {
        if (error instanceof ApiError) return error;
        if (error instanceof Error) {
            return new ApiError({
                message: error.message,
                code: "UNKNOWN_ERROR",
                status: 500,
            });
        }
        return new ApiError({
            message: "Une erreur inattendue est survenue",
            code: "UNKNOWN_ERROR",
            status: 500,
        });
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isForbidden(): boolean {
        return this.status === 403;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    get isValidationError(): boolean {
        return this.status === 400 && !!this.validationErrors;
    }

    get title(): string {
        if (this.isUnauthorized) return "Identifiants invalides";
        if (this.isForbidden) return "Accès refusé";
        if (this.isNotFound) return "Ressource introuvable";
        if (this.isValidationError) return "Champs invalides";
        if (this.status === 0) return "Connexion impossible";
        if (this.status === 408) return "Délai dépassé";
        if (this.status >= 500) return "Erreur serveur";
        return "Une erreur est survenue";
    }

    get description(): string {
        if (this.isUnauthorized) {
            return "Vérifiez votre adresse e-mail et votre mot de passe, puis réessayez.";
        }
        if (this.isForbidden) {
            return "Vous n'avez pas les autorisations nécessaires pour accéder à cette ressource.";
        }
        if (this.isNotFound) {
            return "La ressource demandée n'existe pas ou a été supprimée.";
        }
        if (this.isValidationError) {
            return "Certains champs ne respectent pas le format attendu.";
        }
        if (this.status === 0) {
            return "Impossible de joindre le serveur. Vérifiez votre connexion internet.";
        }
        if (this.status === 408) {
            return "Le serveur met trop de temps à répondre. Veuillez réessayer.";
        }
        if (this.status >= 500) {
            return "Une erreur est survenue côté serveur. Nos équipes sont prévenues.";
        }
        return this.message || "Une erreur est survenue, veuillez réessayer.";
    }
}