export function formatDate(date: string | Date | null | undefined, locale = "fr-FR"): string {
    if (!date) return "-";
    try {
        return new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(date));
    } catch {
        return "-";
    }
}

export function formatDateTime(date: string | Date | null | undefined, locale = "fr-FR"): string {
    if (!date) return "-";
    try {
        return new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    } catch {
        return "-";
    }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
    if (!date) return "-";
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHour < 24) return `Il y a ${diffHour} h`;
    if (diffDay < 7) return `Il y a ${diffDay} j`;
    return formatDate(date);
}

export function formatNumber(value: number | null | undefined, locale = "fr-FR"): string {
    if (value == null) return "0";
    return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(
    value: number | null | undefined,
    currency = "MGA",
    locale = "fr-FR"
): string {
    if (value == null) return "0 Ar";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatCompactNumber(value: number | null | undefined, locale = "fr-FR"): string {
    if (value == null) return "0";
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export function formatFileSize(bytes: number | null | undefined): string {
    if (bytes == null || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatPercent(value: number | null | undefined, decimals = 0): string {
    if (value == null) return "0%";
    return `${value.toFixed(decimals)}%`;
}

export function truncate(text: string | null | undefined, length: number): string {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
}

export function getInitials(firstName?: string, lastName?: string): string {
    const f = firstName?.trim()?.[0] ?? "";
    const l = lastName?.trim()?.[0] ?? "";
    return `${f}${l}`.toUpperCase() || "?";
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}