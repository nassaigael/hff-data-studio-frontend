"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
    context?: "login" | "sidebar" | "auto";
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    href?: string;
    className?: string;
}

const sizeMap = {
    sm: { width: 140, height: 42 },
    md: { width: 180, height: 54 },
    lg: { width: 240, height: 72 },
    xl: { width: 360, height: 108 },
    "2xl": { width: 480, height: 144 },
};

export function Logo({
    context = "auto",
    size = "md",
    href,
    className,
}: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const dimensions = sizeMap[size];

    const resolveLogoSrc = (): string => {
        if (context === "login") return "/logos/hff-login-logo.png";
        if (context === "sidebar") return "/logos/hff-sidebar-logo.png";
        const isDark = mounted && resolvedTheme === "dark";
        return isDark ? "/logos/hff-sidebar-logo.png" : "/logos/hff-login-logo.png";
    };

    const content = (
        <img
            src={resolveLogoSrc()}
            alt="HFF Data Studio"
            width={dimensions.width}
            height={dimensions.height}
            className={cn("h-auto w-auto object-contain", className)}
            style={{ maxHeight: dimensions.height }}
        />
    );

    if (href) {
        return (
            <Link
                href={href}
                className="inline-flex items-center transition-opacity hover:opacity-90"
            >
                {content}
            </Link>
        );
    }

    return content;
}

export function LogoIcon({
    size = 40,
    className,
}: {
    size?: number;
    className?: string;
}) {
    return (
        <img
            src="/logos/hff-icon.png"
            alt="HFF"
            width={size}
            height={size}
            className={cn("h-auto w-auto object-contain", className)}
        />
    );
}