"use client";

import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ProjectEmptyTabProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    disabled?: boolean;
}

export function ProjectEmptyTab({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    disabled = false,
}: ProjectEmptyTabProps) {
    return (
        <div className="flex min-h-100 flex-col items-center justify-center gap-6 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-hff-yellow/20 blur-2xl" />
                <div
                    className={cn(
                        "relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-linear-to-br from-hff-navy/5 to-hff-navy/10 shadow-lg"
                    )}
                >
                    <Icon className="h-10 w-10 text-hff-navy" strokeWidth={1.5} />
                </div>
            </div>

            <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    disabled={disabled}
                    className="gap-2 rounded-xl bg-hff-yellow text-hff-navy shadow-lg shadow-hff-yellow/30 hover:bg-hff-yellow/90"
                >
                    <Plus className="h-4 w-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}