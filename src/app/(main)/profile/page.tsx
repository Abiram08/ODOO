"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    LogOut,
    Settings,
    CreditCard,
    Globe,
    Award,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [trips, setTrips] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user stats/trips
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (session?.user?.email) {
            // In a real app, this would be a dedicated profile/stats endpoint
            // For now, we reuse the trips API to count
            fetch("/api/trips")
                .then(res => res.json())
                .then(data => {
                    if (data.trips) setTrips(data.trips);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [session, status, router]);

    if (status === "loading" || isLoading) {
        return <div className="p-10 text-center">Loading profile...</div>;
    }

    const user = session?.user;

    // Stats
    const totalTrips = trips.length;
    const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date()).length;
    const pastTrips = totalTrips - upcomingTrips;
    // Mock countries count logic (would need robust city data)
    const countriesVisited = new Set(trips.flatMap(t => t.stops?.map((s: any) => s.city?.country) || [])).size;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in px-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#2C2C2C]">My Profile</h1>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* ID Card / Sidebar */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F5E6D3] text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-[#FF6B4A]/10 rounded-full flex items-center justify-center text-4xl font-bold text-[#FF6B4A]">
                            {user?.name?.[0] || "U"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C2C2C]">{user?.name}</h2>
                            <p className="text-[#6B5B4F]">{user?.email}</p>
                        </div>
                        <div className="pt-4 border-t border-[#E8DDD0] grid grid-cols-2 gap-4 text-left">
                            <div>
                                <label className="text-xs text-[#6B5B4F] uppercase font-bold">Member Since</label>
                                <div className="text-[#2C2C2C] font-medium">Jan 2026</div>
                            </div>
                            <div>
                                <label className="text-xs text-[#6B5B4F] uppercase font-bold">Status</label>
                                <div className="text-[#10B981] font-medium flex items-center gap-1">
                                    <Award className="w-3 h-3" /> Traveler
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Mockup */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden">
                        <div className="p-4 hover:bg-[#F5E6D3]/20 cursor-pointer flex items-center gap-3 border-b border-[#F5E6D3]">
                            <Settings className="w-5 h-5 text-[#6B5B4F]" /> Account Settings
                        </div>
                        <div className="p-4 hover:bg-[#F5E6D3]/20 cursor-pointer flex items-center gap-3 border-b border-[#F5E6D3]">
                            <CreditCard className="w-5 h-5 text-[#6B5B4F]" /> Billing & Plans
                        </div>
                        <div className="p-4 hover:bg-[#F5E6D3]/20 cursor-pointer flex items-center gap-3">
                            <Globe className="w-5 h-5 text-[#6B5B4F]" /> Language & Region
                        </div>
                    </div>
                </div>

                {/* Main Content: Stats & Activity */}
                <div className="md:col-span-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] text-white p-6 rounded-2xl shadow-lg shadow-[#FF6B4A]/30">
                            <div className="text-4xl font-bold mb-1">{totalTrips}</div>
                            <div className="text-white/80 text-sm font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Total Trips
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E6D3]">
                            <div className="text-4xl font-bold text-[#2C2C2C] mb-1">{countriesVisited}</div>
                            <div className="text-[#6B5B4F] text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Countries
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E6D3]">
                            <div className="text-4xl font-bold text-[#2C2C2C] mb-1">{upcomingTrips}</div>
                            <div className="text-[#6B5B4F] text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Upcoming
                            </div>
                        </div>
                    </div>

                    {/* Recent Trips Preview */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F5E6D3]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-[#2C2C2C]">Recent Journeys</h3>
                            <Link href="/trips" className="text-sm text-[#FF6B4A] font-medium hover:underline">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {trips.length === 0 ? (
                                <div className="text-center py-10 text-[#6B5B4F] bg-[#F9FAFB] rounded-xl">
                                    No trips yet. <Link href="/trips/new" className="text-[#FF6B4A] font-bold">Plan one now?</Link>
                                </div>
                            ) : (
                                trips.slice(0, 3).map(trip => (
                                    <div key={trip.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F5E6D3]/20 transition-colors border border-transparent hover:border-[#E8DDD0]">
                                        <img src={trip.coverPhotoUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
                                            className="w-16 h-16 rounded-xl object-cover bg-gray-200" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#2C2C2C]">{trip.name}</h4>
                                            <div className="text-xs text-[#6B5B4F] flex gap-2 mt-1">
                                                <span>{format(new Date(trip.startDate), "MMM yyyy")}</span>
                                                <span>•</span>
                                                <span className="capitalize">{trip.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-[#2C2C2C]">{trip.currency} {trip.totalEstimatedCost}</div>
                                            <div className="text-xs text-[#6B5B4F]">{trip.travelStyle || "Balanced"}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
