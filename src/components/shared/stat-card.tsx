import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: {
        value: string;
        positive?: boolean;
    };
    accent?: "navy" | "yellow" | "success" | "warning" | "muted";
    className?: string;
}

const ACCENT_STYLES = {
    navy: "bg-hff-navy/10 text-hff-navy",
    yellow: "bg-hff-yellow/20 text-hff-navy",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    muted: "bg-muted text-muted-foreground",
};

export function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    accent = "navy",
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
                className
            )}
        >
            <div
                className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    ACCENT_STYLES[accent]
                )}
            >
                <Icon className="h-6 w-6" strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
                    {value}
                </p>
                {trend && (
                    <p
                        className={cn(
                            "mt-0.5 text-xs font-medium",
                            trend.positive !== false ? "text-success" : "text-destructive"
                        )}
                    >
                        {trend.value}
                    </p>
                )}
            </div>
        </div>
    );
}