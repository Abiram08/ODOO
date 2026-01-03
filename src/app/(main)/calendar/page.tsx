"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    LayoutGrid,
    Plus,
    Camera,
    Plane,
    Hotel,
    Utensils,
    IndianRupee,
    ChevronDown,
} from "lucide-react";

function getEventIcon(type: string) {
    switch (type) {
        case "activity": return Camera;
        case "transport": return Plane;
        case "hotel": return Hotel;
        case "food": return Utensils;
        default: return CalendarIcon;
    }
}

export default function CalendarPage() {
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips");
                const data = await res.json();
                if (data.data?.length > 0) {
                    setTrips(data.data);
                    setSelectedTripId(data.data[0].id);
                } else {
                    setError("No trips found. Create a trip to see your calendar!");
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

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/trips/${selectedTripId}`);
                const data = await res.json();
                if (data.data) {
                    setTrip(data.data);
                    const startDate = new Date(data.data.startDate);
                    setSelectedDate(startDate.getDate());
                }
            } catch (err) {
                setError("Failed to fetch trip details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [selectedTripId]);

    if (loading && !trip) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#6B5B4F] animate-pulse">Syncing your dates...</p>
            </div>
        );
    }

    if (error && !trip) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#F5E6D3]">
                <div className="w-16 h-16 bg-[#F87171]/10 text-[#F87171] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">{error}</h2>
                <Link href="/trips/new" className="text-[#FF6B4A] font-semibold hover:underline">
                    Plan your first trip
                </Link>
            </div>
        );
    }

    // Map trip data to events
    const events: any[] = [];
    trip.stops?.forEach((stop: any) => {
        const arrivalDate = new Date(stop.arrivalDate);

        // Stay event
        events.push({
            date: arrivalDate.getDate(),
            month: arrivalDate.getMonth(),
            year: arrivalDate.getFullYear(),
            type: "hotel",
            title: stop.accommodationName || `Stay in ${stop.city?.name}`,
            time: "2:00 PM",
            cost: stop.accommodationCost || 0,
            color: "#FF6B4A"
        });

        // Activity events
        stop.activities?.forEach((act: any) => {
            events.push({
                date: arrivalDate.getDate(),
                month: arrivalDate.getMonth(),
                year: arrivalDate.getFullYear(),
                type: "activity",
                title: act.name,
                time: act.scheduledTime || "Flexible",
                cost: act.actualCost || act.estimatedCost || 0,
                color: "#2D5016"
            });
        });
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startDate = new Date(trip.startDate);
    const calendarMonth = startDate.getMonth();
    const calendarYear = startDate.getFullYear();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const startDay = new Date(calendarYear, calendarMonth, 1).getDay();

    const dailyTotals: Record<number, number> = {};
    events.forEach((e) => {
        if (e.month === calendarMonth && e.year === calendarYear) {
            dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.cost;
        }
    });

    const tripDays: number[] = [];
    const dateCursor = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    while (dateCursor <= endDate) {
        if (dateCursor.getMonth() === calendarMonth && dateCursor.getFullYear() === calendarYear) {
            tripDays.push(dateCursor.getDate());
        }
        dateCursor.setDate(dateCursor.getDate() + 1);
    }

    const dayEvents = selectedDate ? events.filter((e) => e.date === selectedDate && e.month === calendarMonth && e.year === calendarYear) : [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/trips/${selectedTripId || "new"}`} className="p-2 rounded-xl hover:bg-[#F5E6D3] transition-colors">
                        <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C2C2C]">
                            {monthNames[calendarMonth]} {calendarYear}
                        </h1>
                        <p className="text-[#6B5B4F]">{trip.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Trip Selector */}
                    <div className="relative mr-2">
                        <select
                            value={selectedTripId || ""}
                            onChange={(e) => setSelectedTripId(e.target.value)}
                            className="appearance-none bg-white border border-[#E8DDD0] text-[#2C2C2C] py-2 px-4 pr-10 rounded-xl focus:outline-none focus:border-[#FF6B4A] cursor-pointer text-sm"
                        >
                            {trips.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5B4F] pointer-events-none" />
                    </div>

                    <button className="p-2 rounded-xl hover:bg-[#F5E6D3] transition-colors">
                        <ChevronLeft className="w-5 h-5 text-[#6B5B4F]" />
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-[#E8DDD0] text-[#6B5B4F] font-medium hover:border-[#FF6B4A] transition-colors text-sm">
                        Today
                    </button>
                    <button className="p-2 rounded-xl hover:bg-[#F5E6D3] transition-colors">
                        <ChevronRight className="w-5 h-5 text-[#6B5B4F]" />
                    </button>

                    {/* View Toggle */}
                    <div className="hidden md:flex items-center bg-white rounded-xl border border-[#E8DDD0] p-1 ml-2">
                        {[
                            { id: "month", icon: LayoutGrid },
                            { id: "week", icon: CalendarIcon },
                            { id: "day", icon: List },
                        ].map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setViewMode(view.id as typeof viewMode)}
                                className={`p-2 rounded-lg transition-colors ${viewMode === view.id ? "bg-[#FF6B4A] text-white" : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                                    }`}
                            >
                                <view.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-[#F5E6D3]">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="py-3 text-center text-sm font-medium text-[#6B5B4F]">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Cells */}
                    <div className="grid grid-cols-7">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-[#F5E6D3] bg-[#F5E6D3]/20" />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const date = i + 1;
                            const isTrip = tripDays.includes(date);
                            const cellEvents = events.filter((e) => e.date === date && e.month === calendarMonth && e.year === calendarYear);
                            const isSelected = selectedDate === date;
                            const dailyTotal = dailyTotals[date] || 0;

                            return (
                                <div
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`min-h-[120px] p-2 border-b border-r border-[#F5E6D3] cursor-pointer transition-all ${isTrip ? "bg-[#FF6B4A]/5" : ""
                                        } ${isSelected ? "ring-2 ring-[#FF6B4A] ring-inset" : "hover:bg-[#F5E6D3]/30"}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${isTrip
                                                ? "bg-[#FF6B4A] text-white"
                                                : "text-[#2C2C2C]"
                                                }`}
                                        >
                                            {date}
                                        </span>
                                        {dailyTotal > 0 && (
                                            <span className="text-xs font-medium text-[#FF6B4A]">
                                                ₹{(dailyTotal / 1000).toFixed(1)}K
                                            </span>
                                        )}
                                    </div>

                                    {/* Events */}
                                    <div className="space-y-1">
                                        {cellEvents.slice(0, 3).map((event, j) => (
                                            <div
                                                key={j}
                                                className="px-2 py-1 rounded text-[10px] font-medium text-white truncate"
                                                style={{ backgroundColor: event.color }}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {cellEvents.length > 3 && (
                                            <span className="text-[10px] text-[#6B5B4F]">+{cellEvents.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Day Detail Sidebar */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] p-5 border-l-4 border-l-[#FF6B4A]">
                    {selectedDate ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-[#2C2C2C]">
                                    {monthNames[calendarMonth]} {selectedDate}
                                </h3>
                                <p className="text-[#6B5B4F]">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(startDay + selectedDate - 1) % 7]}day
                                </p>
                                {dailyTotals[selectedDate] && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-[#FF6B4A]" />
                                        <span className="font-bold text-[#FF6B4A]">
                                            ₹{dailyTotals[selectedDate].toLocaleString()}
                                        </span>
                                        <span className="text-sm text-[#6B5B4F]">total spend</span>
                                    </div>
                                )}
                            </div>

                            {dayEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {dayEvents.map((event, i) => {
                                        const Icon = getEventIcon(event.type);
                                        return (
                                            <div
                                                key={i}
                                                className="p-3 rounded-xl border border-[#F5E6D3] hover:bg-[#F5E6D3]/30 transition-colors"
                                            >
                                                <div className="flex items-start gap-3 text-left">
                                                    <div
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: `${event.color}20` }}
                                                    >
                                                        <Icon className="w-4 h-4" style={{ color: event.color }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-[#2C2C2C] truncate">{event.title}</p>
                                                        <p className="text-sm text-[#6B5B4F]">{event.time}</p>
                                                    </div>
                                                    {event.cost > 0 && (
                                                        <span className="font-semibold text-[#FF6B4A] text-sm">
                                                            ₹{event.cost.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-[#6B5B4F] py-8">No events this day</p>
                            )}

                            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#D9C4A9] text-[#6B5B4F] font-medium hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Event
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-12 h-12 mx-auto text-[#D9C4A9] mb-3" />
                            <p className="text-[#6B5B4F]">Select a date to see details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#F5E6D3]">
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-sm font-medium text-[#2C2C2C]">Legend:</span>
                    {[
                        { color: "#FF6B4A", label: "Accommodation" },
                        { color: "#F59E0B", label: "Transport" },
                        { color: "#2D5016", label: "Activities" },
                        { color: "#10B981", label: "Food & Dining" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-[#6B5B4F]">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
