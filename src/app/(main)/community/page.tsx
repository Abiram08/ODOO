"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, ArrowRight, Star, Heart } from "lucide-react";
import { format } from "date-fns";

export default function CommunityPage() {
    const [trips, setTrips] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // In a real app, fetch /api/trips?public=true
        // For now, we'll fetch all and filter or simulate
        fetch("/api/trips")
            .then(res => res.json())
            .then(data => {
                if (data.trips) {
                    // Simulate "Community" by showing all trips (or filter by isPublic if we implemented it)
                    // For demo, we just show all trips as 'community' contributions
                    setTrips(data.trips);
                }
            });
    }, []);

    const filteredTrips = trips.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.stops?.some((s: any) => s.city.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C2C2C]">Community Trips</h1>
                    <p className="text-[#6B5B4F] mt-1">Discover, copy, and remix itineraries from fellow travelers.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5B4F]" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search for Paris, Bali, budget trips..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DDD0] focus:ring-2 focus:ring-[#FF6B4A] outline-none"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTrips.map(trip => (
                    <div key={trip.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-xl hover:-translate-y-1 transition-all">
                        {/* Cover Image */}
                        <div className="h-48 relative bg-gray-200">
                            {trip.coverPhotoUrl ? (
                                <img src={trip.coverPhotoUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#6B5B4F] bg-[#F5E6D3]/30">
                                    <MapPin className="w-10 h-10 opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-[#2C2C2C] shadow-sm">
                                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                                4.9
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-sm font-medium">
                                {trip.travelStyle || "Balanced"}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-[#2C2C2C] group-hover:text-[#FF6B4A] transition-colors">{trip.name}</h3>
                                    <div className="text-xs text-[#6B5B4F] flex items-center gap-2 mt-1">
                                        by <span className="font-medium text-[#2C2C2C]">Traveler</span> • {format(new Date(trip.startDate), 'MMM yyyy')}
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-[#F5E6D3] rounded-full text-[#6B5B4F] transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Route Preview */}
                            <div className="flex items-center gap-2 text-sm text-[#2C2C2C]">
                                <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                                <span className="truncate">
                                    {trip.stops?.map((s: any) => s.city?.name).join(" → ") || "No stops yet"}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-[#E8DDD0] flex justify-between items-center">
                                <span className="font-bold text-[#2C2C2C]">
                                    {trip.currency} {trip.totalEstimatedCost}
                                </span>
                                <Link href={`/trips/${trip.id}`} className="flex items-center gap-1 text-sm font-bold text-[#FF6B4A] hover:underline">
                                    View Details <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTrips.length === 0 && (
                <div className="text-center py-20 bg-[#F9FAFB] rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No trips found matching your search.</p>
                    <button onClick={() => setSearch("")} className="text-[#FF6B4A] font-bold hover:underline">Clear filters</button>
                </div>
            )}
        </div>
    );
}
