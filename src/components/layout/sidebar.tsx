"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    Globe,
    LayoutDashboard,
    Map,
    PlusCircle,
    Search,
    Settings,
    LogOut,
    Menu,
    X,
    Calendar,
    IndianRupee,
    BarChart3,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/trips", icon: Map, label: "My Trips" },
    { href: "/trips/new", icon: PlusCircle, label: "New Trip" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { href: "/budget", icon: IndianRupee, label: "Budget" },
    { href: "/admin", icon: BarChart3, label: "Analytics" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-[#E8DDD0]"
            >
                {isMobileOpen ? <X className="w-6 h-6 text-[#2C2C2C]" /> : <Menu className="w-6 h-6 text-[#2C2C2C]" />}
            </button>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-[#E8DDD0]
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-[#E8DDD0]">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center shadow-md">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[#2C2C2C]">GlobeTrotter</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                                            ? "bg-gradient-to-r from-[#FF6B4A]/10 to-[#F59E0B]/10 text-[#FF6B4A] font-medium"
                                            : "text-[#6B5B4F] hover:bg-[#F5E6D3] hover:text-[#2C2C2C]"
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-[#FF6B4A]" : ""}`} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-[#FF6B4A]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="p-4 border-t border-[#E8DDD0]">
                        {/* User info */}
                        {session?.user && (
                            <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-[#F5E6D3]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center text-white font-medium shadow-md">
                                    {session.user.name?.[0] || session.user.email?.[0] || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#2C2C2C] truncate">
                                        {session.user.name || "User"}
                                    </p>
                                    <p className="text-xs text-[#6B5B4F] truncate">{session.user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Settings & Logout */}
                        <div className="space-y-1">
                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#6B5B4F] hover:bg-[#F5E6D3] transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#E63E23] hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
