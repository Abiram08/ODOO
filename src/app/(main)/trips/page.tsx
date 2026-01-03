"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Plus,
    MapPin,
    Calendar,
    IndianRupee,
    ChevronRight,
    LayoutGrid,
    List,
    Star,
    Loader2,
} from "lucide-react";

// Mock data for trips (fallback/demo)
const mockTrips = [
    {
        id: "mock-1",
        name: "Rajasthan Heritage Tour",
        destinations: ["Jaipur", "Udaipur", "Jodhpur"],
        startDate: "2026-02-15",
        endDate: "2026-02-22",
        status: "upcoming",
        budget: 45000,
        spent: 12000,
        coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop",
        rating: 4.8,
    },
    {
        id: "mock-2",
        name: "Kerala Backwaters",
        destinations: ["Kochi", "Alleppey", "Munnar"],
        startDate: "2026-03-10",
        endDate: "2026-03-16",
        status: "draft",
        budget: 38000,
        spent: 0,
        coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
        rating: null,
    },
    {
        id: "mock-3",
        name: "Goa Beach Vacation",
        destinations: ["North Goa", "South Goa"],
        startDate: "2025-12-20",
        endDate: "2025-12-26",
        status: "completed",
        budget: 28000,
        spent: 26500,
        coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop",
        rating: 4.5,
    },
];

interface Trip {
    id: string;
    name: string;
    destinations: string[];
    startDate: string;
    endDate: string;
    status: string;
    budget: number;
    spent: number;
    coverImage: string;
    rating: number | null;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getStatusBadge(status: string) {
    switch (status) {
        case "upcoming":
            return { bg: "bg-[#FF6B4A]", text: "text-white", label: "Upcoming" };
        case "completed":
            return { bg: "bg-[#10B981]", text: "text-white", label: "Completed" };
        case "draft":
            return { bg: "bg-[#F59E0B]", text: "text-white", label: "Draft" };
        default:
            return { bg: "bg-gray-200", text: "text-gray-700", label: status };
    }
}

export default function TripsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [trips, setTrips] = useState<Trip[]>(mockTrips);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch trips from API
    useEffect(() => {
        async function fetchTrips() {
            try {
                const response = await fetch("/api/trips");
                if (response.ok) {
                    const data = await response.json();
                    // Combine API trips with mock trips
                    const apiTrips: Trip[] = data.data?.map((trip: any) => ({
                        id: trip.id,
                        name: trip.name,
                        destinations: trip.cities || [],
                        startDate: trip.startDate,
                        endDate: trip.endDate,
                        status: trip.status,
                        budget: trip.totalEstimatedCost || 0,
                        spent: 0,
                        coverImage: trip.coverPhotoUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
                        rating: null,
                    })) || [];
                    // Show API trips first, then mock trips for demo
                    setTrips([...apiTrips, ...mockTrips]);
                }
            } catch (error) {
                console.error("Failed to fetch trips:", error);
                // Keep mock data on error
            } finally {
                setIsLoading(false);
            }
        }
        fetchTrips();
    }, []);

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.destinations.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C2C2C]">My Trips</h1>
                    <p className="text-[#6B5B4F] mt-1">
                        {filteredTrips.length} trips planned
                    </p>
                </div>
                <Link
                    href="/trips/new"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-semibold shadow-lg shadow-[#FF6B4A]/30 hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Plan New Trip
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5B4F]" />
                    <input
                        type="text"
                        placeholder="Search trips or destinations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E8DDD0] bg-white text-[#2C2C2C] focus:outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 transition-all"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-[#E8DDD0] bg-white text-[#2C2C2C] focus:outline-none focus:border-[#FF6B4A] cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-white rounded-xl border border-[#E8DDD0] p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#FF6B4A] text-white" : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                                }`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#FF6B4A] text-white" : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trips Grid */}
            {filteredTrips.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F5E6D3] flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-[#D9C4A9]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">No trips found</h3>
                    <p className="text-[#6B5B4F] mb-6">Start planning your next adventure!</p>
                    <Link
                        href="/trips/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Plan Your First Trip
                    </Link>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrips.map((trip) => {
                        const status = getStatusBadge(trip.status);
                        const budgetProgress = (trip.spent / trip.budget) * 100;

                        return (
                            <Link
                                key={trip.id}
                                href={`/trips/${trip.id}`}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                {/* Cover Image */}
                                <div className="relative h-48">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                        style={{ backgroundImage: `url(${trip.coverImage})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Status Badge */}
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                        {status.label}
                                    </span>

                                    {/* Rating */}
                                    {trip.rating && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur">
                                            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                                            <span className="text-xs font-semibold text-[#2C2C2C]">{trip.rating}</span>
                                        </div>
                                    )}

                                    {/* Destinations */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white/80 text-sm flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {trip.destinations.join(" → ")}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-[#2C2C2C] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                                        {trip.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-[#6B5B4F] mb-4">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                    </div>

                                    {/* Budget Progress */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1 text-[#6B5B4F]">
                                                <IndianRupee className="w-4 h-4" />
                                                Budget
                                            </span>
                                            <span className="font-semibold text-[#2C2C2C]">
                                                {formatCurrency(trip.budget)}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${budgetProgress > 90 ? "bg-[#EF4444]" : budgetProgress > 70 ? "bg-[#F59E0B]" : "bg-[#10B981]"
                                                    }`}
                                                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-[#6B5B4F]">
                                            {formatCurrency(trip.spent)} spent
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div className="space-y-4">
                    {filteredTrips.map((trip) => {
                        const status = getStatusBadge(trip.status);
                        const budgetProgress = (trip.spent / trip.budget) * 100;

                        return (
                            <Link
                                key={trip.id}
                                href={`/trips/${trip.id}`}
                                className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-xl transition-all group"
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-56 h-40 md:h-auto">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                        style={{ backgroundImage: `url(${trip.coverImage})` }}
                                    />
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-xl text-[#2C2C2C] mb-1 group-hover:text-[#FF6B4A] transition-colors">
                                            {trip.name}
                                        </h3>
                                        <p className="text-[#6B5B4F] flex items-center gap-1 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            {trip.destinations.join(" → ")}
                                        </p>
                                        <p className="text-sm text-[#6B5B4F] flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-sm text-[#6B5B4F]">Budget</p>
                                            <p className="font-bold text-lg text-[#2C2C2C]">{formatCurrency(trip.budget)}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#D9C4A9] group-hover:text-[#FF6B4A] transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
