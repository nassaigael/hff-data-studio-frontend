import {
    LayoutDashboard,
    FolderKanban,
    Database,
    BarChart3,
    FileText,
    Download,
    Calendar,
    Settings,
    User,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
    exact?: boolean;
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export const MAIN_NAVIGATION: NavSection[] = [
    {
        items: [
            { title: "Accueil", href: "/", icon: LayoutDashboard, exact: true },
            { title: "Projets", href: "/projects", icon: FolderKanban },
            { title: "Données", href: "/datasets", icon: Database },
            { title: "Analyses", href: "/analyses", icon: BarChart3 },
            { title: "Rapports", href: "/reports", icon: FileText },
            { title: "Exports", href: "/exports", icon: Download },
            { title: "Calendrier", href: "/calendar", icon: Calendar },
        ],
    },
];

export const SECONDARY_NAVIGATION: NavSection[] = [
    {
        items: [{ title: "Paramètres", href: "/settings", icon: Settings }],
    },
];

export const USER_MENU_ITEMS: NavItem[] = [
    { title: "Mon profil", href: "/profile", icon: User },
    { title: "Paramètres", href: "/settings", icon: Settings },
];