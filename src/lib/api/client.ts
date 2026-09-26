import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/lib/config/env";
import { authStorage } from "@/lib/auth/storage";
import { ApiError, type ApiErrorResponse } from "./errors";

export const apiClient: AxiosInstance = axios.create({
    baseURL: env.apiUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authStorage.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        const isAuthEndpoint =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/refresh");

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = authStorage.getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, {
                    refreshToken,
                });

                const rememberMe = authStorage.getRememberMe();
                authStorage.setToken(data.accessToken, rememberMe);
                if (data.refreshToken) {
                    authStorage.setRefreshToken(data.refreshToken, rememberMe);
                }

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }
                return apiClient(originalRequest);
            } catch {
                authStorage.clear();
                if (
                    typeof window !== "undefined" &&
                    window.location.pathname !== "/login"
                ) {
                    window.location.href = "/login";
                }
                return Promise.reject(
                    new ApiError({
                        message: "Session expirée. Veuillez vous reconnecter.",
                        code: "TOKEN_EXPIRED",
                        status: 401,
                    })
                );
            }
        }

        if (error.response?.data) {
            return Promise.reject(new ApiError(error.response.data));
        }

        if (error.code === "ECONNABORTED") {
            return Promise.reject(
                new ApiError({
                    message: "La requête a expiré. Veuillez réessayer.",
                    code: "TIMEOUT",
                    status: 408,
                })
            );
        }

        return Promise.reject(
            new ApiError({
                message: error.message || "Erreur réseau",
                code: "NETWORK_ERROR",
                status: 0,
            })
        );
    }
);