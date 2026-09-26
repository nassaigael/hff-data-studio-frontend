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

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    const crumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = ROUTE_LABELS[segment] ?? segment;
        const isLast = index === segments.length - 1;
        return { href, label, isLast };
    });

    return (
        <nav aria-label="Fil d'Ariane" className={cn("flex items-center gap-1.5 text-sm", className)}>
            <Link
                href="/"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Accueil"
            >
                <Home className="h-3.5 w-3.5" />
            </Link>

            {crumbs.map((crumb) => (
                <div key={crumb.href} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                    {crumb.isLast ? (
                        <span className="font-medium text-foreground" aria-current="page">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="rounded-md px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}