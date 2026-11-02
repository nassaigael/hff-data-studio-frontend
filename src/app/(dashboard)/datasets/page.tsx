"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetTable } from "@/components/datasets/dataset-table";
import { DatasetFilters } from "@/components/datasets/dataset-filters";
import { DatasetStatsCards } from "@/components/datasets/dataset-stats-cards";
import { DatasetSidebar } from "@/components/datasets/dataset-sidebar";
import { DatasetListSkeleton } from "@/components/datasets/dataset-skeleton";
import { Pagination } from "@/components/projects/pagination";
import { useUIStore } from "@/stores/ui-store";
import {
  useDatasets,
  useDatasetStatistics,
  useMarkAsCleaned,
  useMarkAsUncleaned,
  useDeleteDataset,
} from "@/hooks/use-datasets";
import type { DatasetResponse } from "@/types/dataset";

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState<DatasetResponse | null>(null);
  const [page, setPage] = useState(0);

  const setHeaderActions = useUIStore((state) => state.setHeaderActions);

  const { data, isLoading, isError } = useDatasets({ page, size: 9 });
  const { data: statistics } = useDatasetStatistics();

  const markAsCleaned = useMarkAsCleaned();
  const markAsUncleaned = useMarkAsUncleaned();
  const deleteDataset = useDeleteDataset();

  useEffect(() => {
    setHeaderActions(
      <Button className="shrink-0 gap-2 rounded-xl bg-hff-yellow text-hff-navy shadow-lg shadow-hff-yellow/30 transition-all hover:bg-hff-yellow/90 hover:shadow-xl hover:shadow-hff-yellow/40">
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
        (statusFilter === "EXPLORED" && !dataset.isCleaned && dataset.processingStatus !== "ERROR") ||
        (statusFilter === "ERROR" && dataset.processingStatus === "ERROR");
      const matchesProject =
        projectFilter === "all" || dataset.projectId === projectFilter;
      const matchesSource = sourceFilter === "all" || dataset.fileFormat === sourceFilter;
      return matchesSearch && matchesStatus && matchesProject && matchesSource;
    });
  }, [datasets, searchTerm, statusFilter, projectFilter, sourceFilter]);

  const projectsList = useMemo(() => {
    const map = new Map<string, string>();
    datasets.forEach((d) => {
      if (d.projectId && d.projectName) map.set(d.projectId, d.projectName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [datasets]);

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
        <DatasetStatsCards
          statistics={statistics}
          analysesCount={73}
          exportsCount={45}
        />

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
          ) : (
            <DatasetTable
              datasets={filteredDatasets}
              selectedDatasetId={selectedDataset?.datasetId}
              onSelect={setSelectedDataset}
              onMarkCleaned={(d) => markAsCleaned.mutate(d.datasetId)}
              onMarkUncleaned={(d) => markAsUncleaned.mutate(d.datasetId)}
              onDelete={(d) => deleteDataset.mutate(d.datasetId)}
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
        </div>
      </div>

      <aside className="hidden h-full w-80 shrink-0 xl:block">
        <DatasetSidebar statistics={statistics} />
      </aside>
    </div>
  );
}