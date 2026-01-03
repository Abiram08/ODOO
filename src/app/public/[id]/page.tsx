"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    MapPin,
    IndianRupee,
    Copy,
    Share2,
    Star,
    Clock,
    Users,
    Hotel,
    Plane,
    Camera,
    Utensils,
    ChevronDown,
    ChevronUp,
    Heart,
} from "lucide-react";

// Public trip data
const publicTrip = {
    id: "abc123",
    name: "Rajasthan Heritage Tour",
    description: "Explore the royal heritage of Rajasthan through magnificent forts, palaces, and vibrant culture. From the Pink City of Jaipur to the romantic lakes of Udaipur and the blue streets of Jodhpur.",
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&h=600&fit=crop",
    creator: {
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        trips: 12,
        memberSince: "Jan 2024",
    },
    stats: {
        duration: "7 days",
        cities: 3,
        activities: 8,
        budget: 45000,
        clones: 23,
        shares: 45,
    },
    stops: [
        {
            id: "s1",
            city: "Jaipur",
            state: "Rajasthan",
            dates: "Feb 15-18",
            days: 3,
            image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop",
            accommodation: { name: "Hotel Pearl Palace", cost: 4500 },
            activities: [
                { name: "Amber Fort Tour", time: "9:00 AM", cost: 500, rating: 4.8 },
                { name: "Hawa Mahal Visit", time: "2:00 PM", cost: 200, rating: 4.6 },
                { name: "Chokhi Dhani Dinner", time: "7:00 PM", cost: 1200, rating: 4.9 },
            ],
        },
        {
            id: "s2",
            city: "Udaipur",
            state: "Rajasthan",
            dates: "Feb 18-20",
            days: 2,
            image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop",
            transport: { type: "Train", name: "Jaipur-Udaipur Express", cost: 850 },
            accommodation: { name: "Lake Pichola Haveli", cost: 5000 },
            activities: [
                { name: "City Palace Tour", time: "10:00 AM", cost: 300, rating: 4.7 },
                { name: "Lake Pichola Boat Ride", time: "4:00 PM", cost: 400, rating: 4.8 },
            ],
        },
        {
            id: "s3",
            city: "Jodhpur",
            state: "Rajasthan",
            dates: "Feb 20-22",
            days: 2,
            image: "https://images.unsplash.com/photo-1585136917228-b5f3e3e0f7a0?w=400&h=300&fit=crop",
            transport: { type: "Bus", name: "RSRTC Volvo", cost: 600 },
            accommodation: { name: "Zostel Jodhpur", cost: 1800 },
            activities: [
                { name: "Mehrangarh Fort", time: "9:00 AM", cost: 600, rating: 4.9 },
                { name: "Blue City Walking Tour", time: "3:00 PM", cost: 500, rating: 4.5 },
            ],
        },
    ],
    budgetBreakdown: [
        { category: "Accommodation", amount: 11300, color: "#FF6B4A" },
        { category: "Transport", amount: 3250, color: "#F59E0B" },
        { category: "Activities", amount: 3700, color: "#2D5016" },
        { category: "Food", amount: 7000, color: "#10B981" },
        { category: "Other", amount: 3000, color: "#6B5B4F" },
    ],
};

export default function PublicItineraryPage() {
    const [expandedStops, setExpandedStops] = useState<string[]>(publicTrip.stops.map((s) => s.id));

    const toggleStop = (id: string) => {
        setExpandedStops((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const totalBudget = publicTrip.budgetBreakdown.reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="min-h-screen bg-[#FFFBF7]">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${publicTrip.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                            {publicTrip.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {publicTrip.stats.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {publicTrip.stats.cities} cities
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Camera className="w-4 h-4" />
                                {publicTrip.stats.activities} activities
                            </span>
                            <span className="flex items-center gap-1.5">
                                <IndianRupee className="w-4 h-4" />
                                {publicTrip.stats.budget.toLocaleString()} budget
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3 mt-6">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                <Copy className="w-5 h-5" />
                                Copy This Trip
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <p className="text-[#6B5B4F] leading-relaxed">{publicTrip.description}</p>
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F5E6D3]">
                                <div className="flex items-center gap-2">
                                    <Copy className="w-4 h-4 text-[#10B981]" />
                                    <span className="text-sm text-[#6B5B4F]">
                                        Cloned <strong className="text-[#2C2C2C]">{publicTrip.stats.clones}</strong> times
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-[#F59E0B]" />
                                    <span className="text-sm text-[#6B5B4F]">
                                        Shared with <strong className="text-[#2C2C2C]">{publicTrip.stats.shares}</strong> people
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">Your Itinerary</h2>

                            {publicTrip.stops.map((stop, i) => {
                                const isExpanded = expandedStops.includes(stop.id);

                                return (
                                    <div key={stop.id} className="relative">
                                        {/* Timeline Connector */}
                                        {i < publicTrip.stops.length - 1 && (
                                            <div className="absolute left-6 top-24 bottom-0 w-0.5 bg-[#FF6B4A]/30" />
                                        )}

                                        {/* Stop Card */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden mb-6 hover:shadow-lg transition-shadow">
                                            {/* Transport Info */}
                                            {stop.transport && (
                                                <div className="px-6 py-3 bg-[#F5E6D3]/50 flex items-center gap-3 text-sm">
                                                    <Plane className="w-4 h-4 text-[#F59E0B]" />
                                                    <span className="text-[#6B5B4F]">
                                                        {stop.transport.type}: {stop.transport.name}
                                                    </span>
                                                    <span className="ml-auto font-semibold text-[#FF6B4A]">
                                                        ₹{stop.transport.cost.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Stop Header */}
                                            <button
                                                onClick={() => toggleStop(stop.id)}
                                                className="w-full flex items-center gap-4 p-6"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div
                                                    className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
                                                    style={{ backgroundImage: `url(${stop.image})` }}
                                                />
                                                <div className="flex-1 text-left">
                                                    <h3 className="text-xl font-bold text-[#2C2C2C]">
                                                        {stop.city}, {stop.state}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-[#6B5B4F] mt-1">
                                                        <span>{stop.dates}</span>
                                                        <span>•</span>
                                                        <span>{stop.days} days</span>
                                                    </div>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-[#6B5B4F]" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[#6B5B4F]" />
                                                )}
                                            </button>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                                                    {/* Accommodation */}
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FF6B4A]/10">
                                                        <Hotel className="w-5 h-5 text-[#FF6B4A]" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-[#2C2C2C]">{stop.accommodation.name}</p>
                                                            <p className="text-sm text-[#6B5B4F]">{stop.days} nights</p>
                                                        </div>
                                                        <p className="font-bold text-[#FF6B4A]">
                                                            ₹{stop.accommodation.cost.toLocaleString()}
                                                        </p>
                                                    </div>

                                                    {/* Activities */}
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-[#2C2C2C]">Activities</h4>
                                                        {stop.activities.map((activity, j) => (
                                                            <div
                                                                key={j}
                                                                className="flex items-center gap-3 p-3 rounded-xl border border-[#F5E6D3] hover:bg-[#F5E6D3]/30 transition-colors"
                                                            >
                                                                <Camera className="w-5 h-5 text-[#2D5016]" />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-[#2C2C2C]">{activity.name}</p>
                                                                    <p className="text-sm text-[#6B5B4F]">{activity.time}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-[#FF6B4A]">
                                                                        ₹{activity.cost.toLocaleString()}
                                                                    </p>
                                                                    <p className="text-xs text-[#6B5B4F] flex items-center gap-1">
                                                                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                                                                        {activity.rating}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Budget Overview */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <h3 className="font-bold text-lg text-[#2C2C2C] mb-4">Budget Breakdown</h3>

                            {/* Mini Donut */}
                            <div className="relative w-40 h-40 mx-auto mb-4">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {publicTrip.budgetBreakdown.map((cat, i) => {
                                        const percentage = (cat.amount / totalBudget) * 100;
                                        const offset = publicTrip.budgetBreakdown
                                            .slice(0, i)
                                            .reduce((sum, c) => sum + (c.amount / totalBudget) * 100, 0);

                                        return (
                                            <circle
                                                key={cat.category}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={cat.color}
                                                strokeWidth="10"
                                                strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                                                strokeDashoffset={-(offset / 100) * 251.2}
                                            />
                                        );
                                    })}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-2xl font-bold text-[#2C2C2C]">₹{(totalBudget / 1000).toFixed(0)}K</p>
                                    <p className="text-xs text-[#6B5B4F]">Total</p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2">
                                {publicTrip.budgetBreakdown.map((cat) => (
                                    <div key={cat.category} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                                            <span className="text-[#6B5B4F]">{cat.category}</span>
                                        </div>
                                        <span className="font-semibold text-[#2C2C2C]">₹{cat.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Creator Profile */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <h3 className="font-bold text-lg text-[#2C2C2C] mb-4">About the Creator</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#FF6B4A]"
                                    style={{ backgroundImage: `url(${publicTrip.creator.avatar})` }}
                                />
                                <div>
                                    <p className="font-bold text-[#2C2C2C]">{publicTrip.creator.name}</p>
                                    <p className="text-sm text-[#6B5B4F]">{publicTrip.creator.trips} trips planned</p>
                                    <p className="text-xs text-[#6B5B4F]">Member since {publicTrip.creator.memberSince}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-semibold hover:shadow-lg transition-all">
                                    Follow
                                </button>
                                <button className="flex-1 py-2 rounded-xl border-2 border-[#E8DDD0] text-[#6B5B4F] font-semibold hover:border-[#FF6B4A] transition-all">
                                    View Profile
                                </button>
                            </div>
                        </div>

                        {/* Sticky CTA */}
                        <div className="sticky top-4 bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] rounded-2xl p-6 text-white">
                            <h4 className="font-bold text-lg mb-2">Love this trip?</h4>
                            <p className="text-white/90 text-sm mb-4">Clone it and customize for your own adventure!</p>
                            <button className="w-full py-3 rounded-xl bg-white text-[#FF6B4A] font-bold hover:bg-[#FFFBF7] transition-colors">
                                Copy This Trip
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
