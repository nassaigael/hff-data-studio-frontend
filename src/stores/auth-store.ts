import { create } from "zustand";
import { authStorage } from "@/lib/auth/storage";
import type { AuthUser } from "@/types/user";

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasHydrated: boolean;
    rememberMe: boolean;

    setUser: (user: AuthUser | null) => void;
    setLoading: (loading: boolean) => void;
    login: (
        user: AuthUser,
        accessToken: string,
        refreshToken: string,
        rememberMe: boolean
    ) => void;
    logout: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    hasHydrated: false,
    rememberMe: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setLoading: (isLoading) => set({ isLoading }),

    login: (user, accessToken, refreshToken, rememberMe) => {
        authStorage.setToken(accessToken, rememberMe);
        authStorage.setRefreshToken(refreshToken, rememberMe);
        authStorage.setUser(user);
        authStorage.setRememberMe(rememberMe);
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
            hasHydrated: true,
            rememberMe,
        });
    },

    logout: () => {
        authStorage.clear();
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            hasHydrated: true,
            rememberMe: false,
        });
    },

    hydrate: () => {
        const token = authStorage.getToken();
        const user = authStorage.getUser<AuthUser>();
        const rememberMe = authStorage.getRememberMe();
        set({
            user,
            isAuthenticated: !!token && !!user,
            isLoading: false,
            hasHydrated: true,
            rememberMe,
        });
    },
}));