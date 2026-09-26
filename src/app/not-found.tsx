import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold text-primary">404</h1>
                <h2 className="mt-4 text-2xl font-semibold">Page introuvable</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Retour à l&apos;accueil</Link>
                </Button>
            </div>
        </div>
    );
}