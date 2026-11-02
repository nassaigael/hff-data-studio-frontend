"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ROUTE_LABELS: Record<string, string> = {
    projects: "Projets",
    datasets: "Données",
    analyses: "Analyses",
    reports: "Rapports",
    exports: "Exports",
    calendar: "Calendrier",
    settings: "Paramètres",
    profile: "Profil",
};

interface BreadcrumbsProps {
    dynamicLabels?: Record<string, string>;
    className?: string;
}

export function Breadcrumbs({ dynamicLabels, className }: BreadcrumbsProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    const crumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const dynamicLabel = dynamicLabels?.[segment];
        const staticLabel = ROUTE_LABELS[segment];
        const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
        const label = dynamicLabel ?? staticLabel ?? (isId ? "Détails" : segment);
        const isLast = index === segments.length - 1;
        return { href, label, isLast };
    });

    return (
        <nav
            aria-label="Fil d'Ariane"
            className={cn("flex items-center gap-1.5 text-sm", className)}
        >
            <Link
                href="/"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Accueil"
            >
                <Home className="h-3.5 w-3.5" />
            </Link>

            {crumbs.map((crumb) => (
                <div key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                    {crumb.isLast ? (
                        <span
                            className="max-w-[240px] truncate font-medium text-foreground"
                            aria-current="page"
                            title={crumb.label}
                        >
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="max-w-[180px] truncate rounded-md px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title={crumb.label}
                        >
                            {crumb.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}