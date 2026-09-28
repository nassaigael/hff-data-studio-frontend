import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types/project";
import { PROJECT_STATUS_LABELS } from "@/types/project";

interface StatusBadgeProps {
    status: ProjectStatus;
    className?: string;
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
    IN_PROGRESS: "bg-hff-blue/15 text-hff-blue hover:bg-hff-blue/20",
    COMPLETED: "bg-success/15 text-success hover:bg-success/20",
    ARCHIVED: "bg-muted text-muted-foreground hover:bg-muted",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <Badge
            variant="muted"
            className={cn("rounded-full font-medium", STATUS_STYLES[status], className)}
        >
            {PROJECT_STATUS_LABELS[status]}
        </Badge>
    );
}