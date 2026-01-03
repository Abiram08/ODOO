"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    MapPin,
    Calendar,
    IndianRupee,
    Plane,
    Clock,
    Star,
    Users,
    Plus,
    ChevronRight,
    Globe,
    Compass,
    TrendingUp,
    Heart,
    Share2,
    Activity,
    Edit2,
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
        day: "numeric",
        month: "short",
    });
}

function getDaysUntil(dateString: string) {
    const today = new Date();
    const target = new Date(dateString);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [trips, setTrips] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [compassRotation, setCompassRotation] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCompassRotation((r) => (r + 1) % 360);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsRes, citiesRes] = await Promise.all([
                    fetch("/api/trips"),
                    fetch("/api/cities")
                ]);
                const tripsData = await tripsRes.json();
                const citiesData = await citiesRes.json();

                setTrips(tripsData.data || []);
                setCities(citiesData.data?.slice(0, 5) || []);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcomingTrips = trips
        .filter(t => new Date(t.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const metrics = [
        { label: "Total Journeys", value: trips.length.toString(), icon: Plane, color: "#FF6B4A" },
        { label: "Total Budget", value: `₹${(trips.reduce((sum, t) => sum + (t.totalEstimatedCost || 0), 0) / 100000).toFixed(1)}L`, icon: IndianRupee, color: "#F59E0B" },
        {
            label: "Total Days", value: trips.reduce((sum, t) => {
                const start = new Date(t.startDate);
                const end = new Date(t.endDate);
                return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            }, 0).toString(), icon: Clock, color: "#2D5016"
        },
        { label: "Destinations", value: new Set(trips.flatMap(t => (t.stops || []).map((s: any) => s.cityId))).size.toString(), icon: Globe, color: "#10B981" },
    ];

    const recentActivity = [
        { type: "created", text: trips.length > 0 ? `Created ${trips[0].name}` : "Plan your first trip!", time: "Recently", icon: Plus, color: "#FF6B4A" },
        { type: "updated", text: "Profile updated", time: "2 days ago", icon: Edit2, color: "#F59E0B" },
    ];

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl"
                    style={{
                        background: "rgba(255, 107, 74, 0.03)",
                        top: "10%",
                        right: "-10%",
                        transform: `translateY(${scrollY * 0.1}px)`,
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full blur-3xl"
                    style={{
                        background: "rgba(245, 158, 11, 0.03)",
                        bottom: "20%",
                        left: "-5%",
                        transform: `translateY(${-scrollY * 0.08}px)`,
                    }}
                />
            </div>

            {/* Welcome Section */}
            <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]"
                style={{
                    transform: `translateY(${-scrollY * 0.02}px)`,
                    transition: "transform 0.3s ease-out",
                }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C2C2C]">
                            Welcome back, {session?.user?.name?.split(" ")[0] || "Traveler"}! 👋
                        </h1>
                        <p className="text-[#6B5B4F] mt-1">
                            You have {upcomingTrips.filter((t) => t.status === "upcoming").length} upcoming trips
                        </p>
                    </div>

                    {/* Quick Action Card */}
                    <div
                        className="bg-gradient-to-br from-[#FFFBF7] to-[#F5E6D3] rounded-xl p-5 border border-[#E8DDD0] hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center shadow-lg"
                                style={{ transform: `rotate(${compassRotation}deg)` }}
                            >
                                <Compass className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#2C2C2C] group-hover:text-[#FF6B4A] transition-colors">
                                    Plan Your Next Trip
                                </h3>
                                <p className="text-sm text-[#6B5B4F]">Start a new adventure</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#D9C4A9] group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Section with Orbiting Effect */}
            <div className="relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, i) => (
                        <div
                            key={metric.label}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3] hover:shadow-xl hover:-translate-y-1 transition-all group"
                            style={{
                                animation: `metricFloat 4s ease-in-out infinite`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform"
                                style={{ backgroundColor: `${metric.color}15` }}
                            >
                                <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                            </div>
                            <p className="text-3xl font-bold text-[#2C2C2C]">{metric.value}</p>
                            <p className="text-sm text-[#6B5B4F]">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upcoming Trips */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#2C2C2C]">Upcoming Trips</h2>
                        <Link href="/trips" className="text-[#FF6B4A] font-medium text-sm hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {upcomingTrips.map((trip, i) => {
                            const daysUntil = getDaysUntil(trip.startDate);

                            return (
                                <Link
                                    key={trip.id}
                                    href={`/trips/${trip.id}`}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-xl hover:-translate-y-1 transition-all group"
                                    style={{
                                        animation: `tripFloat 5s ease-in-out infinite`,
                                        animationDelay: `${i * 0.7}s`,
                                    }}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative w-full md:w-48 h-40 md:h-auto overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                                style={{ backgroundImage: `url(${trip.coverImage})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                            {trip.status === "draft" && (
                                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B] text-white">
                                                    Draft
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#2C2C2C] group-hover:text-[#FF6B4A] transition-colors">
                                                        {trip.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm text-[#6B5B4F] mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {(trip.destinations || trip.stops?.map((s: any) => s.city?.name) || ["Unknown"]).join(" → ")}
                                                    </div>
                                                </div>
                                                {trip.status === "upcoming" && daysUntil > 0 && (
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-[#FF6B4A]">{daysUntil}</p>
                                                        <p className="text-xs text-[#6B5B4F]">days to go</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-[#6B5B4F] mt-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                                </span>
                                                <span className="font-semibold text-[#2C2C2C]">{formatCurrency(trip.budget)}</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between text-xs text-[#6B5B4F] mb-1">
                                                    <span>Planning Progress</span>
                                                    <span className="font-semibold">{trip.progress}%</span>
                                                </div>
                                                <div className="h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B]"
                                                        style={{ width: `${trip.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Create Trip CTA */}
                    <Link
                        href="/trips/new"
                        className="block p-4 rounded-2xl border-2 border-dashed border-[#D9C4A9] text-center hover:border-[#FF6B4A] hover:bg-[#FF6B4A]/5 transition-all group"
                    >
                        <Plus className="w-8 h-8 mx-auto text-[#D9C4A9] group-hover:text-[#FF6B4A] transition-colors" />
                        <p className="mt-2 font-medium text-[#6B5B4F] group-hover:text-[#FF6B4A]">Plan a New Trip</p>
                    </Link>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Popular Destinations Carousel */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                        <h3 className="font-bold text-lg text-[#2C2C2C] mb-4">Trending Destinations</h3>
                        <div
                            ref={carouselRef}
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {cities.map((dest: any) => (
                                <div
                                    key={dest.id}
                                    className="flex-shrink-0 w-36 rounded-xl overflow-hidden border border-[#F5E6D3] hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div
                                        className="h-24 bg-cover bg-center group-hover:scale-105 transition-transform"
                                        style={{ backgroundImage: `url(${dest.imageUrl || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"})` }}
                                    />
                                    <div className="p-3 text-left">
                                        <p className="font-semibold text-[#2C2C2C] text-sm truncate">{dest.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-[#6B5B4F] truncate">{dest.country}</span>
                                            <span className="flex items-center gap-0.5 text-xs">
                                                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                                                4.8
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-[#FF6B4A] mt-1">
                                            {dest.costIndex > 5 ? "Luxury" : "Budget"} • ₹{(dest.costIndex * 2000).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                        <h3 className="font-bold text-lg text-[#2C2C2C] mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 animate-fade-in"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${activity.color}15` }}
                                    >
                                        <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#2C2C2C] truncate">{activity.text}</p>
                                        <p className="text-xs text-[#6B5B4F]">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate Demo Trip Button */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                        <h3 className="font-bold text-lg text-[#2C2C2C] mb-2">New Account?</h3>
                        <p className="text-sm text-[#6B5B4F] mb-4">Generate sample data to see how it looks.</p>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    // Quick fetch to auto-create a trip logic (simulated)
                                    // In real app, call /api/seed-user-data
                                    // Here we just pretend by using the router to go to a pre-filled state or just reload
                                    alert("Demo Data Generated! (Simulated)");
                                    // Ideally, we'd POST to an endpoint. For now, just user feedback.
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="w-full py-2 bg-[#F5E6D3] text-[#6B5B4F] font-bold rounded-xl hover:bg-[#E8DDD0] transition-colors"
                        >
                            Generate Demo Trip
                        </button>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-br from-[#FF6B4A] to-[#E63E23] rounded-2xl p-5 text-white">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Pro Tip</h4>
                                <p className="text-sm text-white/90">
                                    Book Rajasthan hotels during weekdays for up to 30% savings!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes metricFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes tripFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
        </div>
    );
}
