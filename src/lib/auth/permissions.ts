import { PERMISSIONS, type Permission } from "@/lib/constants/permissions";
import type { UserRole } from "@/types/user";

export function hasPermission(
    userPermissions: string[] | undefined,
    permission: Permission
): boolean {
    if (!userPermissions) return false;
    return userPermissions.includes(permission);
}

export function hasAnyPermission(
    userPermissions: string[] | undefined,
    permissions: Permission[]
): boolean {
    if (!userPermissions || permissions.length === 0) return false;
    return permissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(
    userPermissions: string[] | undefined,
    permissions: Permission[]
): boolean {
    if (!userPermissions || permissions.length === 0) return false;
    return permissions.every((p) => userPermissions.includes(p));
}

export function isAdmin(role: UserRole | undefined): boolean {
    return role === "ADMIN";
}

export function canAccessAdmin(userPermissions: string[] | undefined, role: UserRole | undefined): boolean {
    if (isAdmin(role)) return true;
    return hasAnyPermission(userPermissions, [
        PERMISSIONS.USER_VIEW,
        PERMISSIONS.CATEGORY_VIEW,
        PERMISSIONS.AUDIT_VIEW,
    ]);
}

export { PERMISSIONS };