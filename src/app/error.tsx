"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Une erreur est survenue</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error.message || "Impossible de charger cette page."}
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Recharger
                    </Button>
                    <Button onClick={reset}>Réessayer</Button>
                </div>
            </div>
        </div>
    );
}