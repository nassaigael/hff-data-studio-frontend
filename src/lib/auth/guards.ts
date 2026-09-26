import { authStorage } from "./storage";
import { isTokenExpired } from "./token";

export function isAuthenticated(): boolean {
    const token = authStorage.getToken();
    if (!token) return false;
    return !isTokenExpired(token);
}

export function requireAuth(): boolean {
    if (!isAuthenticated()) {
        authStorage.clear();
        return false;
    }
    return true;
}