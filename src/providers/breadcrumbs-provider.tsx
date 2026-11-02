"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface BreadcrumbsContextValue {
    dynamicLabels: Record<string, string>;
    setDynamicLabel: (id: string, label: string) => void;
    removeDynamicLabel: (id: string) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

export function BreadcrumbsContextProvider({ children }: { children: ReactNode }) {
    const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});

    const setDynamicLabel = useCallback((id: string, label: string) => {
        setDynamicLabels((prev) => (prev[id] === label ? prev : { ...prev, [id]: label }));
    }, []);

    const removeDynamicLabel = useCallback((id: string) => {
        setDynamicLabels((prev) => {
            if (!(id in prev)) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ dynamicLabels, setDynamicLabel, removeDynamicLabel }),
        [dynamicLabels, setDynamicLabel, removeDynamicLabel]
    );

    return (
        <BreadcrumbsContext.Provider value={value}>
            {children}
        </BreadcrumbsContext.Provider>
    );
}

export function useBreadcrumbs() {
    const context = useContext(BreadcrumbsContext);
    if (!context) {
        throw new Error("useBreadcrumbs must be used within a BreadcrumbsContextProvider");
    }
    return context;
}

export function useBreadcrumbLabel(id: string | undefined, label: string | undefined) {
    const { setDynamicLabel, removeDynamicLabel } = useBreadcrumbs();

    useEffect(() => {
        if (!id || !label) return;
        setDynamicLabel(id, label);
        return () => removeDynamicLabel(id);
    }, [id, label, setDynamicLabel, removeDynamicLabel]);
}