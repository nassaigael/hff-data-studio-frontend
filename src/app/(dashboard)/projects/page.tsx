"use client";

import { useEffect, useMemo, useState } from "react";
import { PanelRightOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTable } from "@/components/projects/project-table";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectPreviewSidebar } from "@/components/projects/project-preview-sidebar";
import { ProjectStatistics } from "@/components/projects/project-statistics";
import { RecentActivity } from "@/components/projects/recent-activity";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { Pagination } from "@/components/projects/pagination";
import { useProjects, useProjectStatistics } from "@/hooks/use-projects";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils/cn";
import type { ProjectResponse, ProjectStatus } from "@/types/project";

type StatusFilter = "all" | ProjectStatus;

const TAB_CONFIG: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous les projets" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminés" },
  { value: "ARCHIVED", label: "Archivés" },
];

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilterDropdown, setStatusFilterDropdown] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [showActivity, setShowActivity] = useState(true);
  const [page, setPage] = useState(0);

  const setHeaderActions = useUIStore((state) => state.setHeaderActions);

  useEffect(() => {
    setHeaderActions(null);
    return () => setHeaderActions(null);
  }, [setHeaderActions]);

  const { data, isLoading, isError } = useProjects({
    page,
    size: 9,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: statistics } = useProjectStatistics();

  const projects = data?.content ?? [];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchTerm === "" ||
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || project.category === categoryFilter;
      const matchesCreator =
        creatorFilter === "all" || project.creatorFullName === creatorFilter;
      const matchesStatus =
        statusFilterDropdown === "all" || project.status === statusFilterDropdown;
      return matchesSearch && matchesCategory && matchesCreator && matchesStatus;
    });
  }, [projects, searchTerm, categoryFilter, creatorFilter, statusFilterDropdown]);

  const uniqueCreators = useMemo(() => {
    const set = new Set(projects.map((p) => p.creatorFullName));
    return Array.from(set).sort();
  }, [projects]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilterDropdown("all");
    setCategoryFilter("all");
    setCreatorFilter("all");
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as StatusFilter);
              setPage(0);
            }}
            className="min-w-0"
          >
            <TabsList>
              {TAB_CONFIG.map((tab) => {
                const count =
                  tab.value === "all"
                    ? statistics?.totalProjects
                    : tab.value === "IN_PROGRESS"
                      ? statistics?.inProgress
                      : tab.value === "COMPLETED"
                        ? statistics?.completed
                        : statistics?.archived;

                return (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                    {count !== undefined && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <Button className="shrink-0 gap-2 rounded-xl bg-hff-yellow text-hff-navy shadow-lg shadow-hff-yellow/30 transition-all hover:bg-hff-yellow/90 hover:shadow-xl hover:shadow-hff-yellow/40">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </div>

        <div className="shrink-0">
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            status={statusFilterDropdown}
            onStatusChange={setStatusFilterDropdown}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            creator={creatorFilter}
            onCreatorChange={setCreatorFilter}
            creators={uniqueCreators}
            onReset={resetFilters}
          />
        </div>

        <div className="min-h-0 flex-1">
          {isLoading ? (
            <ProjectListSkeleton />
          ) : isError ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Impossible de charger les projets
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vérifiez votre connexion et réessayez
                </p>
              </div>
            </div>
          ) : (
            <ProjectTable
              projects={filteredProjects}
              selectedProjectId={selectedProject?.projectId}
              onSelect={setSelectedProject}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/60 pt-4">
          {!isLoading && !isError && data ? (
            <Pagination
              currentPage={data.pageNumber}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setShowActivity((v) => !v)}
            className={cn(
              "hff-blink flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95",
              showActivity
                ? "bg-hff-navy text-hff-yellow shadow-hff-navy/30"
                : "bg-hff-yellow text-hff-navy shadow-hff-yellow/40"
            )}
            aria-label={
              showActivity ? "Masquer l'activité récente" : "Afficher l'activité récente"
            }
          >
            <PanelRightOpen
              className={cn(
                "h-4 w-4 transition-transform",
                showActivity ? "rotate-180" : "rotate-0"
              )}
            />
            {showActivity ? "Masquer l'activité" : "Activité"}
          </button>
        </div>
      </div>

      {showActivity && (
        <div className="hff-scrollbar hidden h-full w-80 shrink-0 flex-col gap-4 overflow-auto xl:flex">
          {selectedProject ? (
            <ProjectPreviewSidebar
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          ) : (
            <>
              <ProjectStatistics />
              <RecentActivity onClose={() => setShowActivity(false)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}