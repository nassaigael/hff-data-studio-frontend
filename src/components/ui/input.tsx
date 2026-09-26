import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "peer flex h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-all duration-200",
          "placeholder:text-muted-foreground/60",
          "hover:border-border hover:bg-background/80",
          "focus-visible:border-hff-navy focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hff-navy/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };