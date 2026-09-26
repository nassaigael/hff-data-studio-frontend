interface JwtPayload {
    sub?: string;
    exp?: number;
    iat?: number;
    authorities?: string[];
    [key: string]: unknown;
}

function base64UrlDecode(str: string): string {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    if (typeof window === "undefined") {
        return Buffer.from(padded, "base64").toString("utf-8");
    }
    return decodeURIComponent(
        atob(padded)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join("")
    );
}

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    const payload = decodeJwt(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now();
}

export function getTokenExpiresIn(token: string): number {
    const payload = decodeJwt(token);
    if (!payload?.exp) return 0;
    return payload.exp * 1000 - Date.now();
}