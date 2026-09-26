export const APP_CONFIG = {
    pagination: {
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 30, 50, 100],
        maxPageSize: 100,
    },

    upload: {
        maxFileSize: 200 * 1024 * 1024,
        acceptedTypes: [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/json",
            "application/sql",
        ],
        acceptedExtensions: [".csv", ".xlsx", ".xls", ".json", ".sql"],
    },

    session: {
        tokenKey: "hff_access_token",
        refreshKey: "hff_refresh_token",
        userKey: "hff_user",
        idleTimeoutMs: 30 * 60 * 1000,
    },

    theme: {
        storageKey: "hff_theme",
        defaultTheme: "light" as const,
    },

    toast: {
        duration: 4000,
    },
} as const;