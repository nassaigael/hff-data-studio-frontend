import { Skeleton } from "@/components/ui/skeleton";

export function DatasetListSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex-1 space-y-0">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 border-b border-border/40 px-4 py-4 last:border-0"
                    >
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-3 max-w-[200px] flex-1" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}