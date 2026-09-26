import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
        </div>
    );
}