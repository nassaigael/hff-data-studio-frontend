import { Shield, TrendingUp, Zap } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function LoginBranding() {
    return (
        <div
            className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-12 text-white lg:flex"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="relative z-10">
                <Logo context="login" size="2xl" href="/" />
            </div>

            <div className="relative z-10 max-w-lg space-y-6">
                <h1 className="text-4xl font-bold leading-tight">
                    Transformez vos données de vente{" "}
                    <span className="text-hff-yellow">en décisions stratégiques</span>
                </h1>
                <p className="text-lg text-white/80">
                    HFF Data Studio vous accompagne dans l&apos;analyse, la visualisation
                    et l&apos;exploitation de vos données pour améliorer la performance de
                    votre entreprise.
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4">
                <Feature
                    icon={Shield}
                    title="Sécurisé"
                    description="Données protégées avec les plus hauts standards."
                />
                <Feature
                    icon={TrendingUp}
                    title="Intelligent"
                    description="Analyses puissantes pour des insights pertinents."
                />
                <Feature
                    icon={Zap}
                    title="Efficace"
                    description="Gagnez du temps et prenez de meilleures décisions."
                />
            </div>
        </div>
    );
}

function Feature({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof Shield;
    title: string;
    description: string;
}) {
    return (
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hff-yellow/20">
                <Icon className="h-5 w-5 text-hff-yellow" />
            </div>
            <div className="text-sm font-semibold">{title}</div>
            <p className="text-xs text-white/70">{description}</p>
        </div>
    );
}