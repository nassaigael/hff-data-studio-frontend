import { Skeleton } from "@/components/ui/skeleton";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";

export default function ProjectsLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-full max-w-xl" />
            <ProjectListSkeleton />
        </div>
    );
}