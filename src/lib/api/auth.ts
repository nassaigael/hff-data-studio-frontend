import { apiClient } from "./client";
import type { LoginRequest, TokenResponse } from "@/types/auth";
import type { User } from "@/types/user";

export const authApi = {
    async login(data: LoginRequest): Promise<TokenResponse> {
        const response = await apiClient.post<TokenResponse>("/auth/login", data);
        return response.data;
    },

    async refresh(refreshToken: string): Promise<TokenResponse> {
        const response = await apiClient.post<TokenResponse>("/auth/refresh", {
            refreshToken,
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    },

    async getMe(): Promise<User> {
        const response = await apiClient.get<User>("/auth/me");
        return response.data;
    },
};