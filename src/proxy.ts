import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register");
    const isPublicPage = req.nextUrl.pathname === "/" ||
        req.nextUrl.pathname.startsWith("/share/") ||
        req.nextUrl.pathname.startsWith("/api/shared/");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    // Allow public pages and shared routes
    if (isPublicPage) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users to login (except for public API routes)
    if (!isLoggedIn && !isAuthPage && !isApiRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
