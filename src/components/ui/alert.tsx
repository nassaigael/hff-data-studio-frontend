import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const alertVariants = cva(
    "relative flex w-full gap-3 rounded-xl border p-4 text-sm shadow-sm backdrop-blur-sm animate-fade-in",
    {
        variants: {
            variant: {
                error: "border-destructive/20 bg-destructive/[0.04] shadow-destructive/5",
                success: "border-hff-yellow/50 bg-hff-yellow/[0.08] shadow-hff-yellow/10",
                warning: "border-warning/30 bg-warning/[0.05] shadow-warning/5",
                info: "border-hff-navy/15 bg-hff-navy/[0.03] shadow-hff-navy/5",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

const iconVariants = cva(
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
    {
        variants: {
            variant: {
                error: "bg-destructive/10 text-destructive",
                success: "bg-hff-yellow/25 text-hff-navy",
                warning: "bg-warning/15 text-warning",
                info: "bg-hff-navy/10 text-hff-navy",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

const titleVariants = cva("font-semibold leading-tight", {
    variants: {
        variant: {
            error: "text-destructive",
            success: "text-hff-navy",
            warning: "text-warning",
            info: "text-hff-navy",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: TriangleAlert,
    info: Info,
} as const;

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    title?: string;
    description?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = "info", title, description, children, ...props }, ref) => {
        const Icon = icons[variant ?? "info"];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <div className={cn(iconVariants({ variant }))}>
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                    {title && <p className={cn(titleVariants({ variant }))}>{title}</p>}
                    {description && (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        );
    }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };