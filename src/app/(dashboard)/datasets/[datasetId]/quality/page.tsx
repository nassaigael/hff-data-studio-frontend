"use client";

import { use } from "react";
import { Loader2, Maximize2, Minimize2, ShieldCheck } from "lucide-react";
import { useDatasetColumns } from "@/hooks/use-datasets";
import { useUIStore } from "@/stores/ui-store";
import { DatasetColumnsTable } from "@/components/datasets/dataset-columns-table";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ datasetId: string }>;
}

export default function DatasetQualityPage({ params }: PageProps) {
    const { datasetId } = use(params);
    const { data: columns, isLoading } = useDatasetColumns(datasetId);

    const isMaximized = useUIStore((state) => state.isDatasetMaximized);
    const toggleMaximized = useUIStore((state) => state.toggleDatasetMaximized);

    if (isLoading) {
        return (
            <div className="flex w-full flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-5 py-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Détail par colonne</h2>
                        <p className="text-[10px] text-muted-foreground">
                            Analyse des valeurs manquantes et des types
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {columns?.length ?? 0} colonnes
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMaximized}
                        className="h-8 w-8 p-0 rounded-lg"
                        title={isMaximized ? "Réduire" : "Plein écran"}
                    >
                        {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="hff-scrollbar flex-1 overflow-auto">
                <DatasetColumnsTable columns={columns ?? []} />
            </div>
        </div>
    );
}