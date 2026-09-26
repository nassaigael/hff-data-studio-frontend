"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api/auth";
import { authStorage } from "@/lib/auth/storage";
import { ApiError } from "@/lib/api/errors";
import type { LoginFormData } from "@/lib/validators/auth";
import type { AuthUser } from "@/types/user";

export function useAuth() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, hasHydrated, login, logout, hydrate } =
        useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const tokens = await authApi.login({
                email: data.email.trim().toLowerCase(),
                password: data.password,
            });

            authStorage.setToken(tokens.accessToken, data.rememberMe);
            authStorage.setRefreshToken(tokens.refreshToken, data.rememberMe);

            try {
                const apiUser = await authApi.getMe();
                const currentUser: AuthUser = {
                    ...apiUser,
                    permissions: apiUser.permissions ?? [],
                };
                return { tokens, user: currentUser, rememberMe: data.rememberMe };
            } catch (error) {
                authStorage.clear();
                throw error;
            }
        },
        onSuccess: ({ tokens, user: authUser, rememberMe }) => {
            login(authUser, tokens.accessToken, tokens.refreshToken, rememberMe);
            toast.success("Connexion réussie", {
                description: `Bienvenue ${authUser.firstName}`,
            });
            router.push("/");
        },
        onError: (error) => {
            const apiError = ApiError.from(error);
            toast.error(apiError.title, {
                description: apiError.description,
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await authApi.logout().catch(() => { });
        },
        onSettled: () => {
            logout();
            toast.success("Déconnexion réussie");
            router.push("/login");
        },
    });

    const loginApiError =
        loginMutation.error instanceof ApiError
            ? loginMutation.error
            : loginMutation.error
                ? ApiError.from(loginMutation.error)
                : null;

    return {
        user,
        isAuthenticated,
        isLoading,
        hasHydrated,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginApiError,
    };
}