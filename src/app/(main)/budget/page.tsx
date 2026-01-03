"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Hotel,
    Plane,
    Utensils,
    Camera,
    ShoppingBag,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Calendar,
    Info,
    Plus,
    Edit2,
    Trash2,
    ChevronDown,
} from "lucide-react";

export default function BudgetBreakdownPage() {
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips");
                const data = await res.json();
                if (data.data?.length > 0) {
                    setTrips(data.data);
                    setSelectedTripId(data.data[0].id);
                } else {
                    setError("No trips found. Create a trip to see its budget!");
                    setLoading(false);
                }
            } catch (err) {
                setError("Failed to fetch trips");
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    useEffect(() => {
        if (!selectedTripId) return;

        const fetchTripDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/trips/${selectedTripId}`);
                const data = await res.json();
                if (data.data) {
                    setTrip(data.data);
                    setAnimationProgress(0);
                    setTimeout(() => setAnimationProgress(100), 100);
                }
            } catch (err) {
                setError("Failed to fetch trip details");
            } finally {
                setLoading(false);
            }
        };
        fetchTripDetails();
    }, [selectedTripId]);

    if (loading && !trip) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#6B5B4F] animate-pulse">Calculating your expenses...</p>
            </div>
        );
    }

    if (error && !trip) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#F5E6D3]">
                <div className="w-16 h-16 bg-[#F87171]/10 text-[#F87171] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">{error}</h2>
                <Link href="/trips/new" className="text-[#FF6B4A] font-semibold hover:underline">
                    Create your first trip
                </Link>
            </div>
        );
    }

    const budgetSummary = trip.budgetSummary;
    const totalSpent = budgetSummary.accommodation + budgetSummary.activities;
    const totalEstimated = trip.totalEstimatedCost;
    const remaining = totalEstimated - totalSpent;

    const categories = [
        {
            id: "accommodation",
            name: "Accommodation",
            icon: Hotel,
            color: "#FF6B4A",
            amount: budgetSummary.accommodation,
            items: trip.stops.map((s: any) => ({
                name: s.accommodationName || `Stay in ${s.city?.name}`,
                amount: s.accommodationCost || 0,
                date: new Date(s.arrivalDate).toLocaleDateString()
            })).filter((i: any) => i.amount > 0)
        },
        {
            id: "activities",
            name: "Activities",
            icon: Camera,
            color: "#F59E0B",
            amount: budgetSummary.activities,
            items: trip.stops.flatMap((s: any) => s.activities.map((a: any) => ({
                name: a.name,
                amount: a.actualCost || a.estimatedCost || 0,
                date: new Date(s.arrivalDate).toLocaleDateString()
            })))
        },
        {
            id: "other",
            name: "Other",
            icon: ShoppingBag,
            color: "#6B5B4F",
            amount: 0,
            items: []
        }
    ].filter(c => c.amount > 0 || c.id === "accommodation");

    const filteredCategories = selectedCategory
        ? categories.filter((c) => c.id === selectedCategory)
        : categories;

    const days = Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)));


    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/trips/${selectedTripId || "new"}`} className="p-2 rounded-xl hover:bg-[#F5E6D3] transition-colors">
                        <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C2C2C]">Trip Budget Breakdown</h1>
                        <p className="text-[#6B5B4F]">{trip.name} • {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Trip Selector */}
                <div className="relative">
                    <select
                        value={selectedTripId || ""}
                        onChange={(e) => setSelectedTripId(e.target.value)}
                        className="appearance-none bg-white border border-[#E8DDD0] text-[#2C2C2C] py-2 px-4 pr-10 rounded-xl focus:outline-none focus:border-[#FF6B4A] cursor-pointer"
                    >
                        {trips.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5B4F] pointer-events-none" />
                </div>
            </div>

            {/* Main Chart Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#F5E6D3]">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Donut Chart */}
                    <div className="relative mx-auto">
                        <svg viewBox="0 0 100 100" className="w-72 h-72 -rotate-90">
                            {categories.map((cat, i) => {
                                const percentage = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
                                const offset = categories
                                    .slice(0, i)
                                    .reduce((sum, c) => sum + (c.amount / (totalSpent || 1)) * 100, 0);
                                const circumference = 2 * Math.PI * 40;
                                const strokeDasharray = (percentage / 100) * circumference;
                                const strokeDashoffset = -(offset / 100) * circumference;

                                return (
                                    <circle
                                        key={cat.id}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={selectedCategory && selectedCategory !== cat.id ? `${cat.color}40` : cat.color}
                                        strokeWidth="12"
                                        strokeDasharray={`${strokeDasharray * (animationProgress / 100)} ${circumference}`}
                                        strokeDashoffset={strokeDashoffset}
                                        className="cursor-pointer transition-all duration-300 hover:opacity-80"
                                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                        style={{
                                            transform: selectedCategory === cat.id ? "scale(1.05)" : "scale(1)",
                                            transformOrigin: "50% 50%",
                                            filter: selectedCategory === cat.id ? `drop-shadow(0 0 8px ${cat.color})` : "none",
                                        }}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-sm text-[#6B5B4F] text-center">Total Spent</p>
                            <p className="text-3xl font-bold text-[#2C2C2C]">₹{totalSpent.toLocaleString()}</p>
                            <p className="text-sm text-[#6B5B4F] text-center">of ₹{totalEstimated.toLocaleString()}</p>
                            <p className={`text-sm font-semibold mt-1 ${remaining >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                                {remaining >= 0 ? `₹${remaining.toLocaleString()} remaining` : `₹${Math.abs(remaining).toLocaleString()} over`}
                            </p>
                        </div>
                    </div>

                    {/* Legend & Stats */}
                    <div className="space-y-4">
                        {categories.map((cat) => {
                            const percentage = totalSpent > 0 ? ((cat.amount / totalSpent) * 100).toFixed(1) : "0.0";
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? "bg-[#F5E6D3]" : "hover:bg-[#F5E6D3]/50"
                                        }`}
                                >
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="flex-1 text-left font-medium text-[#2C2C2C]">{cat.name}</span>
                                    <span className="font-bold text-[#2C2C2C]">₹{cat.amount.toLocaleString()}</span>
                                    <span className="text-sm text-[#6B5B4F]">{percentage}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F5E6D3]">
                    <div className="flex items-center gap-2 text-[#6B5B4F] mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Duration</span>
                    </div>
                    <p className="text-xl font-bold text-[#2C2C2C]">{days} days</p>
                    <p className="text-sm text-[#F59E0B]">trip period</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F5E6D3]">
                    <div className="flex items-center gap-2 text-[#6B5B4F] mb-2">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm">Destinations</span>
                    </div>
                    <p className="text-xl font-bold text-[#2C2C2C]">{trip.stops?.length || 0}</p>
                    <p className="text-sm text-[#10B981]">cities</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F5E6D3]">
                    <div className="flex items-center gap-2 text-[#6B5B4F] mb-2">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-sm">Daily Average</span>
                    </div>
                    <p className="text-xl font-bold text-[#2C2C2C]">₹{Math.round(totalSpent / days).toLocaleString()}</p>
                    <p className="text-sm text-[#6B5B4F]">per day</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F5E6D3]">
                    <div className="flex items-center gap-2 text-[#6B5B4F] mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Total Items</span>
                    </div>
                    <p className="text-xl font-bold text-[#2C2C2C]">{categories.reduce((sum, c) => sum + c.items.length, 0)}</p>
                    <p className="text-sm text-[#6B5B4F]">expenses</p>
                </div>
            </div>

            {/* Daily Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                <h3 className="font-bold text-lg text-[#2C2C2C] mb-4">Daily Breakdown (City Basis)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {trip.stops?.map((stop: any, idx: number) => {
                        const stopTotal = (stop.accommodationCost || 0) + stop.activities?.reduce((s: number, a: any) => s + (a.actualCost || a.estimatedCost || 0), 0);
                        const intensity = Math.min(100, (stopTotal / (totalSpent || 1)) * 300);
                        return (
                            <div
                                key={stop.id}
                                className="p-3 rounded-xl text-center cursor-pointer hover:ring-2 hover:ring-[#FF6B4A] transition-all group"
                                style={{
                                    backgroundColor: `rgba(255, 107, 74, ${intensity / 100 * 0.3})`,
                                }}
                            >
                                <p className="text-xs text-[#6B5B4F]">Stop {idx + 1}</p>
                                <p className="font-semibold text-[#2C2C2C] text-sm truncate">{stop.city?.name}</p>
                                <p className="text-xs font-bold text-[#FF6B4A] mt-1">₹{(stopTotal / 1000).toFixed(1)}K</p>
                            </div>
                        );
                    })}
                </div>
                <p className="text-sm text-[#6B5B4F] text-center mt-3">
                    Darker = Higher spending in city
                </p>
            </div>

            {/* Category Detail Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {filteredCategories.map((cat) => {
                    return (
                        <div
                            key={cat.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] hover:shadow-lg hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${cat.color}15` }}
                                >
                                    <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-[#2C2C2C]">{cat.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold" style={{ color: cat.color }}>
                                            ₹{cat.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {cat.items.map((item: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-lg bg-[#F5E6D3]/30 group hover:bg-[#F5E6D3]/50 transition-colors"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-[#2C2C2C]">{item.name}</p>
                                            <p className="text-xs text-[#6B5B4F]">{item.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[#2C2C2C]">₹{item.amount.toLocaleString()}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 text-[#6B5B4F] hover:text-[#FF6B4A]">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1 text-[#6B5B4F] hover:text-[#EF4444]">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {cat.items.length === 0 && (
                                    <p className="text-sm text-[#6B5B4F] text-center py-4 italic">No expenses recorded in this category.</p>
                                )}
                            </div>

                            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[#FF6B4A] font-medium hover:bg-[#FF6B4A]/5 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Expense
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
