export const ROUTES = {
    home: "/",
    login: "/login",

    dashboard: {
        root: "/",
        projects: "/projects",
        datasets: "/datasets",
        analyses: "/analyses",
        reports: "/reports",
        exports: "/exports",
        calendar: "/calendar",
        settings: "/settings",
        profile: "/profile",
    },
} as const;

export type RouteKey = keyof typeof ROUTES;