import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const AUTH_COOKIE_NAME = "hff_access_token";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token =
        request.cookies.get(AUTH_COOKIE_NAME)?.value ??
        request.headers.get("authorization")?.replace("Bearer ", "");

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // Rediriger vers login si non authentifié et route protégée
    if (!token && !isPublicRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rediriger vers dashboard si déjà authentifié et sur login
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};