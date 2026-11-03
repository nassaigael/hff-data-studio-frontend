"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { BreadcrumbsContextProvider } from "@/providers/breadcrumbs-provider";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Accueil", subtitle: "Vue d'ensemble de votre activité" },
  "/projects": {
    title: "Projets",
    subtitle: "Gérez et suivez tous vos projets d'analyse",
  },
  "/datasets": {
    title: "Données",
    subtitle: "Gérez et consultez vos jeux de données",
  },
  "/analyses": { title: "Analyses", subtitle: "Explorez et analysez vos données" },
  "/reports": { title: "Rapports", subtitle: "Consultez et téléchargez vos rapports" },
  "/exports": { title: "Exports", subtitle: "Gérez et téléchargez vos exports" },
  "/calendar": { title: "Calendrier", subtitle: "Planifiez et suivez vos tâches" },
  "/settings": { title: "Paramètres", subtitle: "Gérez vos préférences" },
  "/profile": { title: "Mon profil", subtitle: "Gérez vos informations personnelles" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname];
  const showBreadcrumbs = pathname !== "/" && pathname.split("/").filter(Boolean).length > 1;

  return (
    <BreadcrumbsContextProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            title={pageInfo?.title}
            subtitle={pageInfo?.subtitle}
            showBreadcrumbs={showBreadcrumbs}
          />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </BreadcrumbsContextProvider>
  );
}