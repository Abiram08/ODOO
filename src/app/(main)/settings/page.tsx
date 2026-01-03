"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    User,
    MapPin,
    Calendar,
    Globe,
    Heart,
    Settings,
    Lock,
    Download,
    Trash2,
    Edit2,
    Plane,
    Mountain,
    Utensils,
    Camera,
    Compass,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

// Mock user data
const mockUserData = {
    name: "Priya Sharma",
    email: "priya@example.com",
    bio: "Passionate traveler exploring the world one city at a time. Love sunsets, street food, and spontaneous adventures.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    travelStyle: "Adventure Seeker",
    memberSince: "January 2024",
    stats: {
        totalTrips: 12,
        daysTraveled: 87,
        countriesVisited: 8,
        savedDestinations: 24,
    },
    preferences: [
        { name: "Nature", color: "#2D5016", icon: Mountain },
        { name: "Adventure", color: "#FF6B4A", icon: Compass },
        { name: "Culture", color: "#F59E0B", icon: Camera },
        { name: "Food", color: "#10B981", icon: Utensils },
    ],
};

const sidebarLinks = [
    { href: "/settings/profile", icon: User, label: "Profile" },
    { href: "/settings/preferences", icon: Heart, label: "Preferences" },
    { href: "/settings/saved", icon: MapPin, label: "Saved Destinations" },
    { href: "/settings/notifications", icon: Bell, label: "Notifications" },
    { href: "/settings/privacy", icon: Shield, label: "Privacy" },
];

function StatCard({
    icon: Icon,
    value,
    label,
    delay,
}: {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
    delay: number;
}) {
    return (
        <div
            className="bg-[#F5E6D3]/50 rounded-xl p-5 text-center group hover:bg-[#F5E6D3] transition-colors"
            style={{
                animation: `bobFloat 3s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-[#2C2C2C]">{value}</p>
            <p className="text-sm text-[#6B5B4F]">{label}</p>
        </div>
    );
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const user = mockUserData;

    return (
        <div className="min-h-screen flex gap-8">
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:block w-64 flex-shrink-0"
                style={{
                    transform: `translateY(${scrollY * 0.05}px)`,
                    transition: "transform 0.3s ease-out",
                }}
            >
                <div className="sticky top-8 bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden">
                    <div className="p-4 border-b border-[#F5E6D3]">
                        <h3 className="font-semibold text-[#2C2C2C]">Settings</h3>
                    </div>
                    <nav className="p-2">
                        {sidebarLinks.map((link, i) => {
                            const isActive = i === 0; // Profile is active by default
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? "bg-[#FF6B4A]/10 text-[#FF6B4A]"
                                            : "text-[#6B5B4F] hover:bg-[#F5E6D3] hover:text-[#2C2C2C] hover:translate-x-1"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-2 border-t border-[#F5E6D3]">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#E63E23] hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl animate-fade-in">
                {/* Floating Profile Card */}
                <div
                    className="bg-white rounded-2xl shadow-lg border border-[#F5E6D3] overflow-hidden"
                    style={{
                        transform: `translateY(${-scrollY * 0.03}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                >
                    {/* Profile Header */}
                    <div className="p-8 text-center border-b border-[#F5E6D3]">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center border-4 border-[#FF6B4A] shadow-xl"
                                style={{ backgroundImage: `url(${user.avatarUrl})` }}
                            />
                            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Name & Email */}
                        <h1 className="text-3xl font-bold text-[#2C2C2C]">
                            {session?.user?.name || user.name}
                        </h1>
                        <p className="text-[#6B5B4F] mt-1">{session?.user?.email || user.email}</p>
                        <p className="text-[#6B5B4F] italic mt-2 max-w-md mx-auto">{user.bio}</p>

                        {/* Travel Style Badge */}
                        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#F59E0B]/10 text-[#2D5016]">
                            <Plane className="w-4 h-4" />
                            <span className="font-semibold text-sm">{user.travelStyle}</span>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-[#2C2C2C] mb-4">Your Journey Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                icon={Plane}
                                value={user.stats.totalTrips}
                                label="Total Trips"
                                delay={0}
                            />
                            <StatCard
                                icon={Calendar}
                                value={user.stats.daysTraveled}
                                label="Days Traveled"
                                delay={0.4}
                            />
                            <StatCard
                                icon={Globe}
                                value={user.stats.countriesVisited}
                                label="Countries Visited"
                                delay={0.8}
                            />
                            <StatCard
                                icon={Heart}
                                value={user.stats.savedDestinations}
                                label="Saved Destinations"
                                delay={1.2}
                            />
                        </div>
                    </div>

                    {/* Travel Preferences */}
                    <div className="p-6 border-t border-[#F5E6D3]">
                        <h2 className="text-lg font-bold text-[#2C2C2C] mb-4">Travel Preferences</h2>
                        <div className="flex flex-wrap gap-3">
                            {user.preferences.map((pref) => (
                                <div
                                    key={pref.name}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-transform hover:scale-105"
                                    style={{ backgroundColor: `${pref.color}15` }}
                                >
                                    <pref.icon className="w-4 h-4" style={{ color: pref.color }} />
                                    <span className="font-medium text-sm" style={{ color: pref.color }}>
                                        {pref.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-t border-[#F5E6D3]">
                        <h2 className="text-lg font-bold text-[#2C2C2C] mb-4">Account Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-semibold shadow-lg shadow-[#FF6B4A]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#E8DDD0] text-[#6B5B4F] font-semibold hover:border-[#FF6B4A] hover:text-[#FF6B4A] hover:-translate-y-0.5 transition-all">
                                <Lock className="w-4 h-4" />
                                Change Password
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#E8DDD0] text-[#6B5B4F] font-semibold hover:border-[#FF6B4A] hover:text-[#FF6B4A] hover:-translate-y-0.5 transition-all">
                                <Download className="w-4 h-4" />
                                Download Data
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#E63E23]/30 text-[#E63E23] font-semibold hover:bg-[#E63E23]/5 hover:-translate-y-0.5 transition-all">
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Member Info */}
                    <div className="px-6 py-4 bg-[#F5E6D3]/30 text-center text-sm text-[#6B5B4F]">
                        Member since {user.memberSince}
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden">
                    <div className="p-4 border-b border-[#F5E6D3]">
                        <h3 className="font-semibold text-[#2C2C2C]">Quick Links</h3>
                    </div>
                    <nav className="p-2">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B5B4F] hover:bg-[#F5E6D3] transition-colors"
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="font-medium">{link.label}</span>
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </main>

            {/* CSS for bob animation */}
            <style jsx>{`
        @keyframes bobFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
        </div>
    );
}
