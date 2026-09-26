import { APP_CONFIG } from "@/lib/constants/config";

const isBrowser = typeof window !== "undefined";

const SESSION_MAX_AGE = 86400;
const REMEMBER_MAX_AGE = 2592000;

function setCookie(name: string, value: string, maxAgeSeconds: number) {
    if (!isBrowser) return;
    const isSecure = window.location.protocol === "https:";
    const secure = isSecure ? "; Secure" : "";
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
    if (!isBrowser) return;
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export const authStorage = {
    getToken(): string | null {
        if (!isBrowser) return null;
        return localStorage.getItem(APP_CONFIG.session.tokenKey);
    },

    setToken(token: string, rememberMe = false): void {
        if (!isBrowser) return;
        localStorage.setItem(APP_CONFIG.session.tokenKey, token);
        const maxAge = rememberMe ? REMEMBER_MAX_AGE : SESSION_MAX_AGE;
        setCookie(APP_CONFIG.session.tokenKey, token, maxAge);
    },

    getRefreshToken(): string | null {
        if (!isBrowser) return null;
        return localStorage.getItem(APP_CONFIG.session.refreshKey);
    },

    setRefreshToken(token: string, rememberMe = false): void {
        if (!isBrowser) return;
        localStorage.setItem(APP_CONFIG.session.refreshKey, token);
        if (rememberMe) {
            setCookie(APP_CONFIG.session.refreshKey, token, REMEMBER_MAX_AGE);
        } else {
            deleteCookie(APP_CONFIG.session.refreshKey);
        }
    },

    getUser<T = unknown>(): T | null {
        if (!isBrowser) return null;
        const raw = localStorage.getItem(APP_CONFIG.session.userKey);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    },

    setUser<T>(user: T): void {
        if (!isBrowser) return;
        localStorage.setItem(APP_CONFIG.session.userKey, JSON.stringify(user));
    },

    getRememberMe(): boolean {
        if (!isBrowser) return false;
        return localStorage.getItem(`${APP_CONFIG.session.tokenKey}_remember`) === "true";
    },

    setRememberMe(remember: boolean): void {
        if (!isBrowser) return;
        localStorage.setItem(`${APP_CONFIG.session.tokenKey}_remember`, String(remember));
    },

    clear(): void {
        if (!isBrowser) return;
        localStorage.removeItem(APP_CONFIG.session.tokenKey);
        localStorage.removeItem(APP_CONFIG.session.refreshKey);
        localStorage.removeItem(APP_CONFIG.session.userKey);
        localStorage.removeItem(`${APP_CONFIG.session.tokenKey}_remember`);
        deleteCookie(APP_CONFIG.session.tokenKey);
        deleteCookie(APP_CONFIG.session.refreshKey);
    },
};