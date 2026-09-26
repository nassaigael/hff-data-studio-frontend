function getEnv(key: string, fallback = ""): string {
    const value = process.env[key];
    if (value === undefined || value === "") {
        if (process.env.NODE_ENV === "production") {
            console.warn(`⚠️ Missing environment variable: ${key}`);
        }
        return fallback;
    }
    return value;
}

function getBoolEnv(key: string, fallback = false): boolean {
    const value = process.env[key];
    if (value === undefined) return fallback;
    return value.toLowerCase() === "true" || value === "1";
}

export const env = {
    apiUrl: getEnv("NEXT_PUBLIC_API_URL", "http://localhost:8080/api/v1"),
    appUrl: getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    appName: getEnv("NEXT_PUBLIC_APP_NAME", "HFF Data Studio"),
    appVersion: getEnv("NEXT_PUBLIC_APP_VERSION", "1.0.0"),

    features: {
        ai: getBoolEnv("NEXT_PUBLIC_ENABLE_AI", false),
        multiTenant: getBoolEnv("NEXT_PUBLIC_ENABLE_MULTI_TENANT", false),
        darkMode: getBoolEnv("NEXT_PUBLIC_ENABLE_DARK_MODE", true),
    },

    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
} as const;