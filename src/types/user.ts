export type UserRole = "ADMIN" | "DATA_ANALYST" | "CONSULTANT" | "INVITE";

export interface Permission {
    permissionId: string;
    code: string;
    label: string;
    module: string;
}

export interface UserCategory {
    categoryId: string;
    label: string;
    description: string | null;
    accessLevel: number;
    permissions: Permission[];
}

export interface User {
    userId: string;
    lastName: string;
    firstName: string;
    email: string;
    isActive: boolean;
    role: UserRole;
    roleLabel: string;
    roleDescription: string;
    createdAt: string;
    lastLogin: string | null;
    category: UserCategory | null;
    permissions: string[];
}

export interface AuthUser extends User {
    permissions: string[];
}