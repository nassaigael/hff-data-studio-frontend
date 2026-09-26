"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils/cn";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn, loginError } = useAuth();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const rememberMe = form.watch("rememberMe");

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
        } catch {
        }
    };

    return (
        <div className="w-full max-w-110">
            <div className="mb-8 flex justify-center lg:hidden">
                <Logo size="lg" />
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/95 p-8 shadow-2xl shadow-hff-navy/10 backdrop-blur-xl lg:p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Bienvenue !
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Connectez-vous pour accéder à votre espace HFF Data Studio
                    </p>
                </div>

                {loginError && (
                    <Alert
                        variant="error"
                        title={loginError.title}
                        description={loginError.description}
                        className="mb-6"
                    />
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Adresse e-mail
                        </Label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-hff-navy" />
                            <input
                                id="email"
                                type="email"
                                placeholder="vous@hff.re"
                                autoComplete="email"
                                autoFocus
                                disabled={isLoggingIn}
                                aria-invalid={!!form.formState.errors.email}
                                aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                className={cn(
                                    "peer flex h-12 w-full rounded-xl border border-border/60 bg-background/50 pl-11 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all duration-200",
                                    "placeholder:text-muted-foreground/50",
                                    "hover:border-border hover:bg-background/80",
                                    "focus-visible:border-hff-navy focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hff-navy/10",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    "aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/10"
                                )}
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p
                                id="email-error"
                                className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-fade-in"
                                role="alert"
                            >
                                <span className="flex h-1 w-1 rounded-full bg-destructive" />
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Mot de passe
                            </Label>
                            <button
                                type="button"
                                className="text-xs font-medium text-hff-navy transition-colors hover:text-hff-blue hover:underline"
                                tabIndex={-1}
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-hff-navy" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={isLoggingIn}
                                aria-invalid={!!form.formState.errors.password}
                                aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                                className={cn(
                                    "peer flex h-12 w-full rounded-xl border border-border/60 bg-background/50 pl-11 pr-12 text-sm shadow-sm backdrop-blur-sm transition-all duration-200",
                                    "placeholder:text-muted-foreground/50",
                                    "hover:border-border hover:bg-background/80",
                                    "focus-visible:border-hff-navy focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hff-navy/10",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    "aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/10"
                                )}
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground"
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p
                                id="password-error"
                                className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-fade-in"
                                role="alert"
                            >
                                <span className="flex h-1 w-1 rounded-full bg-destructive" />
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => form.setValue("rememberMe", !rememberMe, { shouldDirty: true })}
                        disabled={isLoggingIn}
                        className="group flex items-center gap-2.5 transition-opacity disabled:opacity-50"
                    >
                        <div
                            className={cn(
                                "flex h-4.5 w-4.5 items-center justify-center rounded-md border-2 transition-all duration-200",
                                rememberMe
                                    ? "border-hff-navy bg-hff-navy shadow-sm"
                                    : "border-border group-hover:border-hff-navy/50"
                            )}
                        >
                            {rememberMe && (
                                <Check className="h-3 w-3 text-white animate-fade-in" strokeWidth={3} />
                            )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            Se souvenir de moi
                        </span>
                    </button>

                    <Button type="submit" size="lg" disabled={isLoggingIn} className="group w-full">
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Connexion en cours...
                            </>
                        ) : (
                            <>
                                Se connecter
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-3 font-medium uppercase tracking-wider text-muted-foreground">
                            ou continuer avec
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full bg-background/50 backdrop-blur-sm"
                    disabled={isLoggingIn}
                >
                    <GoogleIcon className="h-4 w-4" />
                    Google
                </Button>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <button
                        type="button"
                        className="font-semibold text-hff-navy transition-colors hover:text-hff-blue hover:underline"
                    >
                        Demander un accès
                    </button>
                </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70">
                <Lock className="h-3 w-3" />
                <span>Connexion sécurisée SSL · © 2026 HFF Data Studio</span>
            </div>
        </div>
    );
}

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}