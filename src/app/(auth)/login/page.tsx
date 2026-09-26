import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { LoginBranding } from "./_components/login-branding";

export const metadata: Metadata = {
    title: "Connexion",
    description: "Connectez-vous à votre compte HFF Data Studio",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            <LoginBranding />
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-hff-navy p-6 lg:bg-background lg:p-12">
                <div
                    className="pointer-events-none absolute -right-40 top-0 hidden h-125 w-125 rounded-full bg-hff-yellow/5 blur-3xl lg:block"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-40 -left-20 hidden h-100 w-100 rounded-full bg-hff-navy/5 blur-3xl lg:block"
                    aria-hidden="true"
                />

                <div className="relative z-10 flex w-full justify-center">
                    <Suspense
                        fallback={<div className="text-sm text-muted-foreground">Chargement...</div>}
                    >
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}