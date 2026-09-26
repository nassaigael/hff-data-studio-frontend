"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SearchCommand() {
    const router = useRouter();
    const [isMac, setIsMac] = useState(false);
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setIsMac(typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                const input = document.querySelector<HTMLInputElement>('input[data-search-input="true"]');
                input?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div
                className={cn(
                    "relative flex h-10 w-full items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 shadow-sm backdrop-blur-sm transition-all duration-200",
                    isFocused && "border-hff-navy bg-background shadow-md shadow-hff-navy/5"
                )}
            >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                <input
                    data-search-input="true"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Rechercher un projet, dataset, analyse..."
                    className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <kbd
                    className={cn(
                        "pointer-events-none absolute right-2 hidden h-6 select-none items-center gap-1 rounded-md border border-border/60 bg-muted/50 px-2 font-mono text-[10px] font-medium text-muted-foreground md:flex",
                        isFocused && "opacity-0"
                    )}
                >
                    <Command className="h-3 w-3" />
                    <span>{isMac ? "⌘" : "Ctrl"}</span>
                    <span>K</span>
                </kbd>
            </div>
        </form>
    );
}