import { env } from "./env";

export const siteConfig = {
    name: env.appName,
    version: env.appVersion,
    description: "Transformez vos données de vente en décisions stratégiques",
    url: env.appUrl,
    apiUrl: env.apiUrl,

    company: {
        name: "Henri Fraise & Cie",
        shortName: "HFF",
        email: "contact@hff.re",
        website: "https://hff.re",
    },

    links: {
        docs: "/docs",
        support: "/support",
        helpCenter: "/help",
    },

    social: {
        linkedin: "",
        twitter: "",
        facebook: "",
    },
} as const;