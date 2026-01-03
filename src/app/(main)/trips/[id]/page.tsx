"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    IndianRupee,
    Share2,
    Edit2,
    Plus,
    GripVertical,
    Clock,
    Utensils,
    Camera,
    Train,
    Hotel,
    ChevronDown,
    ChevronUp,
    Trash2,
    CheckCircle2,
    Compass,
} from "lucide-react";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

function getCategoryIcon(category: string) {
    switch (category?.toLowerCase()) {
        case "sightseeing": return Camera;
        case "food": return Utensils;
        case "transport": return Train;
        case "culture": return Compass;
        case "adventure": return Compass;
        default: return Camera;
    }
}

function getCategoryColor(category: string) {
    switch (category?.toLowerCase()) {
        case "sightseeing": return "#FF6B4A";
        case "food": return "#10B981";
        case "transport": return "#2D5016";
        case "culture": return "#2D5016";
        case "adventure": return "#F59E0B";
        default: return "#6B5B4F";
    }
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: tripId } = use(params);
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedStops, setExpandedStops] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<"itinerary" | "budget">("itinerary");
    const [isPublic, setIsPublic] = useState(false);
    const [shareMessage, setShareMessage] = useState("");

    const handleShare = async () => {
        const publicUrl = `${window.location.origin}/public/${tripId}`;
        try {
            await navigator.clipboard.writeText(publicUrl);
            setShareMessage("Link copied!");
            setTimeout(() => setShareMessage(""), 2000);
        } catch {
            setShareMessage("Copy failed");
        }
    };

    const togglePublic = async () => {
        try {
            const newValue = !isPublic;
            await fetch(`/api/trips/${tripId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublic: newValue })
            });
            setIsPublic(newValue);
            if (newValue) {
                setShareMessage("Trip is now public!");
                setTimeout(() => setShareMessage(""), 2000);
            }
        } catch (err) {
            console.error("Failed to update public status:", err);
        }
    };
    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${tripId}`);
                const data = await res.json();
                if (data.data) {
                    setTrip(data.data);
                    setExpandedStops(data.data.stops.map((s: any) => s.id));
                    setIsPublic(data.data.isPublic || false);
                } else {
                    setError("Trip not found");
                }
            } catch (err) {
                setError("Failed to fetch trip data");
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [tripId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#6B5B4F] animate-pulse">Loading your adventure...</p>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#F5E6D3]">
                <div className="w-16 h-16 bg-[#F87171]/10 text-[#F87171] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">{error || "Trip not found"}</h2>
                <Link href="/trips" className="text-[#FF6B4A] font-semibold hover:underline">
                    Back to my trips
                </Link>
            </div>
        );
    }

    const budgetSummary = trip.budgetSummary;
    const totalSpent = budgetSummary.activities + budgetSummary.accommodation;
    const budgetPercentage = (totalSpent / trip.totalEstimatedCost) * 100;

    const categories = [
        { name: "Accommodation", amount: budgetSummary.accommodation, color: "#FF6B4A", icon: Hotel },
        { name: "Activities", amount: budgetSummary.activities, color: "#F59E0B", icon: Camera },
        { name: "Transport", amount: 0, color: "#2D5016", icon: Train },
        { name: "Food", amount: 0, color: "#10B981", icon: Utensils },
        { name: "Misc", amount: 0, color: "#6B5B4F", icon: IndianRupee },
    ].filter(c => c.amount > 0 || c.name === "Accommodation");

    const toggleStop = (stopId: string) => {
        setExpandedStops((prev) =>
            prev.includes(stopId) ? prev.filter((id) => id !== stopId) : [...prev, stopId]
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Cover Image */}
            <div className="relative -mx-6 lg:-mx-8 -mt-6 lg:-mt-8">
                <div
                    className="h-64 lg:h-80 bg-cover bg-center"
                    style={{ backgroundImage: `url(${trip.coverPhotoUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=400&fit=crop"})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Back Button */}
                <Link
                    href="/trips"
                    className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-[#2C2C2C] font-medium hover:bg-white transition-colors shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>

                {/* Actions */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                    {/* Public Toggle */}
                    <button
                        onClick={togglePublic}
                        className={`px-4 py-2 rounded-full backdrop-blur text-sm font-medium transition-colors shadow-lg flex items-center gap-2 ${isPublic ? "bg-[#10B981] text-white" : "bg-white/90 text-[#2C2C2C] hover:bg-white"
                            }`}
                    >
                        {isPublic ? "✓ Public" : "Make Public"}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-3 rounded-full bg-white/90 backdrop-blur text-[#2C2C2C] hover:bg-white transition-colors shadow-lg relative"
                    >
                        <Share2 className="w-5 h-5" />
                        {shareMessage && (
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded">
                                {shareMessage}
                            </span>
                        )}
                    </button>
                    <button className="p-3 rounded-full bg-white/90 backdrop-blur text-[#2C2C2C] hover:bg-white transition-colors shadow-lg">
                        <Edit2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Trip Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B4A] text-white text-sm font-medium mb-3">
                                {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1) || "Planning"}
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{trip.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {trip.stops?.length || 0} destinations
                                </span>
                            </div>
                        </div>

                        {/* Budget Summary Card */}
                        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl min-w-[200px]">
                            <p className="text-sm text-[#6B5B4F] mb-1">Total Budget</p>
                            <p className="text-2xl font-bold text-[#2C2C2C]">{formatCurrency(trip.totalEstimatedCost)}</p>
                            <div className="mt-2 h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${budgetPercentage > 90 ? "bg-[#EF4444]" : budgetPercentage > 70 ? "bg-[#F59E0B]" : "bg-[#10B981]"}`}
                                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-[#6B5B4F] mt-1">{formatCurrency(totalSpent)} spent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#F5E6D3]">
                {[
                    { id: "itinerary", label: "Itinerary", icon: Calendar },
                    { id: "budget", label: "Budget", icon: IndianRupee },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "itinerary" | "budget")}
                        className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors relative ${activeTab === tab.id
                            ? "text-[#FF6B4A]"
                            : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B4A]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Itinerary Tab */}
            {activeTab === "itinerary" && (
                <div className="space-y-6">
                    {trip.stops?.map((stop: any, index: number) => {
                        const isExpanded = expandedStops.includes(stop.id);
                        const nights = Math.max(1, Math.ceil(
                            (new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ));

                        return (
                            <div
                                key={stop.id}
                                className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden"
                            >
                                {/* Stop Header */}
                                <button
                                    onClick={() => toggleStop(stop.id)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-[#F5E6D3]/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Day indicator */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] flex items-center justify-center text-white font-bold text-lg">
                                                {index + 1}
                                            </div>
                                            {index < trip.stops.length - 1 && (
                                                <div className="w-0.5 h-8 bg-[#F5E6D3] mt-2" />
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-[#2C2C2C]">
                                                {stop.city?.name}, {stop.city?.country}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-[#6B5B4F] mt-1">
                                                <span>{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</span>
                                                <span>•</span>
                                                <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                            <p className="font-semibold text-[#2C2C2C]">
                                                {formatCurrency(
                                                    (stop.accommodationCost || 0) +
                                                    stop.activities?.reduce((s: number, a: any) => s + (a.actualCost || a.estimatedCost || 0), 0)
                                                )}
                                            </p>
                                            <p className="text-xs text-[#6B5B4F]">{stop.activities?.length || 0} activities</p>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-[#6B5B4F]" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-[#6B5B4F]" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 space-y-4">
                                        {/* Accommodation */}
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FF6B4A]/10">
                                            <Hotel className="w-5 h-5 text-[#FF6B4A]" />
                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-[#2C2C2C]">{stop.accommodationName || "Not selected"}</p>
                                                <p className="text-sm text-[#6B5B4F]">
                                                    {stop.accommodationCost ? `${formatCurrency(stop.accommodationCost / nights)}/night` : "Set accommodation"} × {nights} nights
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[#FF6B4A]">
                                                {formatCurrency(stop.accommodationCost || 0)}
                                            </p>
                                        </div>

                                        {/* Activities */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-[#2C2C2C]">Activities</h4>
                                                <button className="text-sm text-[#FF6B4A] font-medium hover:underline flex items-center gap-1">
                                                    <Plus className="w-4 h-4" />
                                                    Add Activity
                                                </button>
                                            </div>

                                            {stop.activities?.map((activity: any) => {
                                                const Icon = getCategoryIcon(activity.category);
                                                const color = getCategoryColor(activity.category);

                                                return (
                                                    <div
                                                        key={activity.id}
                                                        className="flex items-center gap-3 p-3 rounded-xl border border-[#F5E6D3] hover:border-[#FF6B4A]/30 hover:shadow-sm transition-all group"
                                                    >
                                                        <GripVertical className="w-4 h-4 text-[#D9C4A9] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                            style={{ backgroundColor: `${color}20` }}
                                                        >
                                                            <Icon className="w-5 h-5" style={{ color }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <p className="font-medium text-[#2C2C2C] truncate">{activity.name}</p>
                                                            <div className="flex items-center gap-2 text-sm text-[#6B5B4F]">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {activity.scheduledTime || "Flexible"} • {activity.duration || "N/A"}
                                                            </div>
                                                        </div>
                                                        <p className="font-semibold text-[#2C2C2C]">{formatCurrency(activity.actualCost || activity.estimatedCost)}</p>
                                                        <button className="p-2 text-[#6B5B4F] hover:text-[#10B981] transition-colors">
                                                            <CheckCircle2 className={`w-5 h-5 ${activity.isCompleted ? "text-[#10B981]" : ""}`} />
                                                        </button>
                                                        <button className="p-2 text-[#6B5B4F] hover:text-[#EF4444] transition-colors opacity-0 group-hover:opacity-100">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Stop Button */}
                    <button className="w-full p-4 rounded-2xl border-2 border-dashed border-[#D9C4A9] text-[#6B5B4F] hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors flex items-center justify-center gap-2 font-medium">
                        <Plus className="w-5 h-5" />
                        Add Another Destination
                    </button>
                </div>
            )}

            {/* Budget Tab */}
            {activeTab === "budget" && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Budget Overview */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                        <h3 className="font-bold text-lg text-[#2C2C2C] mb-6">Budget Overview</h3>

                        {/* Donut Chart */}
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                {categories.map((cat, i) => {
                                    const percentage = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
                                    const offset = categories
                                        .slice(0, i)
                                        .reduce((sum, c) => sum + (c.amount / (totalSpent || 1)) * 100, 0);

                                    return (
                                        <circle
                                            key={cat.name}
                                            cx="18"
                                            cy="18"
                                            r="15.9155"
                                            fill="none"
                                            stroke={cat.color}
                                            strokeWidth="3"
                                            strokeDasharray={`${percentage} ${100 - percentage}`}
                                            strokeDashoffset={-offset}
                                            className="transition-all duration-500"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-[#2C2C2C]">{formatCurrency(totalSpent)}</p>
                                <p className="text-sm text-[#6B5B4F]">of {formatCurrency(trip.totalEstimatedCost)}</p>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="space-y-3">
                            {categories.map((cat) => {
                                const percentage = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;

                                return (
                                    <div key={cat.name} className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${cat.color}20` }}
                                        >
                                            <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-[#2C2C2C]">{cat.name}</p>
                                                <p className="font-semibold text-[#2C2C2C]">{formatCurrency(cat.amount)}</p>
                                            </div>
                                            <div className="h-1.5 bg-[#F5E6D3] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Daily Expenses */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                        <h3 className="font-bold text-lg text-[#2C2C2C] mb-6">Daily Breakdown</h3>

                        <div className="space-y-4">
                            {trip.stops?.map((stop: any, i: number) => {
                                const days = Math.max(1, Math.ceil(
                                    (new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ));
                                const stopTotal =
                                    (stop.accommodationCost || 0) +
                                    stop.activities?.reduce((s: number, a: any) => s + (a.actualCost || a.estimatedCost || 0), 0);
                                const dailyAvg = stopTotal / days;

                                return (
                                    <div key={stop.id} className="p-4 rounded-xl bg-[#F5E6D3]/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] text-white flex items-center justify-center font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="font-medium text-[#2C2C2C]">{stop.city?.name}</span>
                                            </div>
                                            <span className="font-bold text-[#2C2C2C]">{formatCurrency(stopTotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-[#6B5B4F]">
                                            <span>{days} {days === 1 ? "day" : "days"}</span>
                                            <span>≈ {formatCurrency(Math.round(dailyAvg))}/day</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Budget Tips */}
                        <div className="mt-6 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5" />
                                <div className="text-left">
                                    <p className="font-medium text-[#2C2C2C] mb-1">
                                        {totalSpent > trip.totalEstimatedCost ? "You're over budget!" : "You're doing great!"}
                                    </p>
                                    <p className="text-sm text-[#6B5B4F]">
                                        {totalSpent > trip.totalEstimatedCost
                                            ? `You are ${formatCurrency(totalSpent - trip.totalEstimatedCost)} over your planned budget.`
                                            : `You have ${formatCurrency(trip.totalEstimatedCost - totalSpent)} remaining for shopping or emergencies.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
