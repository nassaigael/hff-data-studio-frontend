"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DatasetTable } from "@/components/datasets/dataset-table";
import { DatasetFilters } from "@/components/datasets/dataset-filters";
import { DatasetStatsCards } from "@/components/datasets/dataset-stats-cards";
import { DatasetSidebar } from "@/components/datasets/dataset-sidebar";
import { DatasetListSkeleton } from "@/components/datasets/dataset-skeleton";
import { UploadDialog } from "@/components/datasets/upload-dialog";
import { RenameDialog } from "@/components/datasets/rename-dialog";
import { DeleteConfirmDialog } from "@/components/datasets/delete-confirm-dialog";
import { Pagination } from "@/components/projects/pagination";
import { useUIStore } from "@/stores/ui-store";
import {
  useDatasets,
  useDatasetStatistics,
  useMarkAsCleaned,
  useMarkAsUncleaned,
} from "@/hooks/use-datasets";
import { useStats } from "@/hooks/use-stats";
import { projectsApi } from "@/lib/api/projects";
import type { DatasetResponse } from "@/types/dataset";

export default function DatasetsPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState<DatasetResponse | null>(null);
  const [page, setPage] = useState(0);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DatasetResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DatasetResponse | null>(null);

  const setHeaderActions = useUIStore((state) => state.setHeaderActions);

  const { data, isLoading, isError } = useDatasets({ page, size: 9 });
  const { data: statistics } = useDatasetStatistics();
  const { data: stats, isLoading: statsLoading } = useStats(projectFilter);

  const { data: projectsPage } = useQuery({
    queryKey: ["projects", "for-filter"],
    queryFn: () => projectsApi.getAll({ size: 100 }),
    staleTime: 60_000,
  });

  const markAsCleaned = useMarkAsCleaned();
  const markAsUncleaned = useMarkAsUncleaned();

  useEffect(() => {
    setHeaderActions(
      <Button
        onClick={() => setUploadOpen(true)}
        className="shrink-0 gap-2 rounded-xl bg-hff-yellow text-hff-navy shadow-lg shadow-hff-yellow/30 transition-all hover:bg-hff-yellow/90 hover:shadow-xl hover:shadow-hff-yellow/40"
      >
        <Upload className="h-4 w-4" />
        Importer des données
      </Button>
    );
    return () => setHeaderActions(null);
  }, [setHeaderActions]);

  const datasets = data?.content ?? [];

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch =
        searchTerm === "" ||
        dataset.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.fileName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "CLEANED" && dataset.isCleaned) ||
        (statusFilter === "EXPLORED" &&
          !dataset.isCleaned &&
          dataset.processingStatus !== "ERROR") ||
        (statusFilter === "ANALYZING" && dataset.processingStatus === "ANALYZING") ||
        (statusFilter === "ERROR" && dataset.processingStatus === "ERROR");

      const matchesProject =
        projectFilter === "all" || dataset.projectId === projectFilter;

      const matchesSource =
        sourceFilter === "all" || dataset.fileFormat === sourceFilter;

      return matchesSearch && matchesStatus && matchesProject && matchesSource;
    });
  }, [datasets, searchTerm, statusFilter, projectFilter, sourceFilter]);

  const projectsList = useMemo(() => {
    const list = projectsPage?.content ?? [];
    return list.map((p) => ({ id: p.projectId, name: p.projectName }));
  }, [projectsPage]);

  const sourcesList = useMemo(() => {
    const set = new Set<string>();
    datasets.forEach((d) => {
      if (d.fileFormat) set.add(d.fileFormat);
    });
    return Array.from(set).sort();
  }, [datasets]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setProjectFilter("all");
    setSourceFilter("all");
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        <DatasetStatsCards stats={stats} loading={statsLoading} />

        <div className="shrink-0">
          <DatasetFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            projectId={projectFilter}
            onProjectChange={setProjectFilter}
            projects={projectsList}
            source={sourceFilter}
            onSourceChange={setSourceFilter}
            sources={sourcesList}
            onReset={resetFilters}
          />
        </div>

        <div className="min-h-0 flex-1">
          {isLoading ? (
            <DatasetListSkeleton />
          ) : isError ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Impossible de charger les jeux de données
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vérifiez votre connexion et réessayez
                </p>
              </div>
            </div>
          ) : datasets.length === 0 ? (
            <EmptyState onImport={() => setUploadOpen(true)} />
          ) : (
            <DatasetTable
              datasets={filteredDatasets}
              selectedDatasetId={selectedDataset?.datasetId}
              onSelect={setSelectedDataset}
              onView={(d) => router.push(`/datasets/${d.datasetId}`)}
              onRename={(d) => setRenameTarget(d)}
              onMarkCleaned={(d) => markAsCleaned.mutate(d.datasetId)}
              onMarkUncleaned={(d) => markAsUncleaned.mutate(d.datasetId)}
              onDelete={(d) => setDeleteTarget(d)}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/60 pt-4">
          {!isLoading && !isError && data && datasets.length > 0 ? (
            <Pagination
              currentPage={data.pageNumber}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.pageSize}
              onPageChange={setPage}
              itemLabel="jeux de données"
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      <aside className="hidden h-full w-80 shrink-0 xl:block">
        <DatasetSidebar statistics={statistics} datasets={datasets} />
      </aside>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <RenameDialog
        dataset={renameTarget}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      />
      <DeleteConfirmDialog
        dataset={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}

function EmptyState({ onImport }: { onImport: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-hff-yellow/15">
        <Upload className="h-8 w-8 text-hff-navy" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Aucun jeu de données pour le moment
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Importez votre premier fichier CSV, Excel, JSON ou SQL pour commencer à
          explorer vos données.
        </p>
      </div>
      <Button
        onClick={onImport}
        className="gap-2 rounded-xl bg-hff-yellow text-hff-navy hover:bg-hff-yellow/90"
      >
        <Upload className="h-4 w-4" />
        Importer un fichier
      </Button>
    </div>
  );
}