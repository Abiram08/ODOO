"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Users,
    Globe,
    Plane,
    Star,
    Clock,
    TrendingUp,
    Eye,
    Heart,
    Share2,
    ChevronRight,
    Search,
    Filter,
} from "lucide-react";

interface Trip {
    id: string;
    name: string;
    coverImage?: string;
    startDate: string;
    endDate: string;
    status: string;
    isPublic?: boolean;
    budget?: number;
    stops?: any[];
    user?: {
        name: string;
        profilePhotoUrl?: string;
    };
}

export default function PublicTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    useEffect(() => {
        const fetchPublicTrips = async () => {
            try {
                const res = await fetch("/api/trips/public");
                const data = await res.json();
                setTrips(data.data || []);
            } catch (err) {
                console.error("Failed to fetch public trips:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicTrips();
    }, []);

    const filteredTrips = trips.filter(trip => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return trip.name.toLowerCase().includes(query);
        }
        return true;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D3]/30">
            {/* Header */}
            <div className="bg-white border-b border-[#E8DDD0] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link href="/" className="text-2xl font-bold text-[#FF6B4A]">
                                GlobeTrotter
                            </Link>
                            <p className="text-sm text-[#6B5B4F]">Explore amazing trips from our community</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5B4F]" />
                                <input
                                    type="text"
                                    placeholder="Search trips..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-xl border border-[#E8DDD0] w-64 outline-none focus:border-[#FF6B4A]"
                                />
                            </div>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-[#FF6B4A] text-white rounded-xl font-medium hover:bg-[#E55A3A] transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        🌍 Community Trips
                    </h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Get inspired by amazing travel itineraries shared by fellow travelers around the world
                    </p>
                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{trips.length}</div>
                            <div className="text-sm opacity-80">Public Trips</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{new Set(trips.flatMap(t => t.stops?.map(s => s.cityId) || [])).size}</div>
                            <div className="text-sm opacity-80">Destinations</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trips Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredTrips.length === 0 ? (
                    <div className="text-center py-20">
                        <Globe className="w-16 h-16 mx-auto mb-4 text-[#D9C4A9]" />
                        <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">No Public Trips Yet</h3>
                        <p className="text-[#6B5B4F]">Be the first to share your travel adventures!</p>
                        <Link
                            href="/register"
                            className="inline-block mt-4 px-6 py-3 bg-[#FF6B4A] text-white rounded-xl font-medium hover:bg-[#E55A3A] transition-colors"
                        >
                            Create Your Trip
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrips.map(trip => (
                            <Link
                                key={trip.id}
                                href={`/public/${trip.id}`}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B]">
                                    {trip.coverImage && (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                            style={{ backgroundImage: `url(${trip.coverImage})` }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                            {trip.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-sm text-[#6B5B4F] mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6B5B4F] mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>{trip.stops?.length || 0} destinations</span>
                                    </div>
                                    {trip.user && (
                                        <div className="flex items-center gap-2 pt-4 border-t border-[#F5E6D3]">
                                            <div className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white font-bold">
                                                {trip.user.name?.charAt(0)}
                                            </div>
                                            <span className="text-sm text-[#6B5B4F]">by {trip.user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-[#2C2C2C] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[#A0A0A0]">
                        © 2026 GlobeTrotter. Share your adventures with the world.
                    </p>
                </div>
            </div>
        </div>
    );
}
