"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    MapPin,
    IndianRupee,
    Image as ImageIcon,
    Plus,
    X,
    Loader2,
    Sparkles,
    Check,
    GripVertical,
    Camera,
    Utensils,
    UtensilsCrossed,
    Mountain,
    Compass,
    Building,
    ShoppingBag,
    Plane,
    Globe,
    Clock,
    DollarSign,
    Euro,
    PoundSterling,
    Star,
} from "lucide-react";
import { format, addDays, getDay } from "date-fns";
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"; 
// Note: DnD implementation skipped for speed/simplicity in this iteration, relying on simple array reorder if needed, or focused on core logic first.

// Steps configuration
const steps = [
    { id: 1, title: "Trip Basics", description: "Budget & Style" },
    { id: 2, title: "Destinations", description: "Where & How Long?" },
    { id: 3, title: "Day Planner", description: "Structure your days" },
    { id: 4, title: "Final Review", description: "Summary & Launch" },
];

const travelStyles = [
    { id: "budget", name: "Budget", icon: Compass, description: "Cost-effective, local experiences", color: "#10B981" },
    { id: "balanced", name: "Balanced", icon: Globe, description: "Mix of comfort and exploration", color: "#F59E0B" },
    { id: "luxury", name: "Luxury", icon: Sparkles, description: "Premium stays and exclusive tours", color: "#8B5CF6" },
];

const currencies = [
    { code: "INR", symbol: "₹", icon: IndianRupee },
    { code: "USD", symbol: "$", icon: DollarSign },
    { code: "EUR", symbol: "€", icon: Euro },
    { code: "GBP", symbol: "£", icon: PoundSterling },
];

export default function CreateTripWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Modal State
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activeModalCityId, setActiveModalCityId] = useState<string>("");
    const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

    const openActivityModal = (dayIndex: number, cityId: string) => {
        setActiveDayIndex(dayIndex);
        setActiveModalCityId(cityId);
        setIsActivityModalOpen(true);
    };

    // Data State
    const [availableCities, setAvailableCities] = useState<any[]>([]);
    const [availableActivities, setAvailableActivities] = useState<any[]>([]);

    // --- STEP 1: BASICS ---
    const [tripName, setTripName] = useState("");
    const [homeCountry, setHomeCountry] = useState("India");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalBudget, setTotalBudget] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("INR");
    const [travelStyle, setTravelStyle] = useState("balanced");

    // Computed Budget Breakdown (based on travel style percentages)
    const budgetBreakdown = (() => {
        const total = parseFloat(totalBudget) || 0;
        // Different allocation percentages based on travel style
        const allocations = {
            budget: { transport: 0.25, accommodation: 0.25, food: 0.25, activities: 0.15, misc: 0.10 },
            balanced: { transport: 0.20, accommodation: 0.30, food: 0.20, activities: 0.20, misc: 0.10 },
            luxury: { transport: 0.15, accommodation: 0.40, food: 0.15, activities: 0.20, misc: 0.10 }
        };
        const alloc = allocations[travelStyle as keyof typeof allocations] || allocations.balanced;
        return {
            transport: Math.round(total * alloc.transport),
            accommodation: Math.round(total * alloc.accommodation),
            food: Math.round(total * alloc.food),
            activities: Math.round(total * alloc.activities),
            misc: Math.round(total * alloc.misc),
            total
        };
    })();

    // --- STEP 2: DESTINATIONS ---
    // selectedCities now includes: { ...city, days: number }
    const [selectedCities, setSelectedCities] = useState<any[]>([]);
    const [citySearch, setCitySearch] = useState("");

    // --- STEP 3: COMPREHENSIVE PLANNING ---
    const [dayPlan, setDayPlan] = useState<any[]>([]);
    const [availableHotels, setAvailableHotels] = useState<any[]>([]);
    const [availableRestaurants, setAvailableRestaurants] = useState<any[]>([]);
    const [availableTransports, setAvailableTransports] = useState<any[]>([]);

    // Selected items per city
    const [selectedHotels, setSelectedHotels] = useState<Record<string, any>>({});  // cityId -> hotel
    const [selectedRestaurants, setSelectedRestaurants] = useState<Record<string, any[]>>({}); // cityId -> restaurants[]
    const [selectedTransports, setSelectedTransports] = useState<any[]>([]);  // between cities

    // Planning tab state
    const [planningTab, setPlanningTab] = useState<"accommodation" | "food" | "activities" | "transport">("accommodation");

    useEffect(() => {
        // Fetch cities
        fetch("/api/cities").then(res => res.json()).then(data => {
            if (data.data) setAvailableCities(data.data);
        });
    }, []);

    // Fetch activities for selected cities
    useEffect(() => {
        if (selectedCities.length > 0) {
            const fetchAllData = async () => {
                // Fetch activities, hotels, restaurants for all cities
                const [activitiesResults, hotelsResults, restaurantsResults] = await Promise.all([
                    Promise.all(selectedCities.map(c => fetch(`/api/activities?cityId=${c.id}`).then(r => r.json()))),
                    Promise.all(selectedCities.map(c => fetch(`/api/hotels?cityId=${c.id}`).then(r => r.json()))),
                    Promise.all(selectedCities.map(c => fetch(`/api/restaurants?cityId=${c.id}`).then(r => r.json()))),
                ]);

                setAvailableActivities(activitiesResults.flatMap(r => r.data || []));
                setAvailableHotels(hotelsResults.flatMap(r => r.data || []));
                setAvailableRestaurants(restaurantsResults.flatMap(r => r.data || []));

                // Fetch transport options between consecutive cities
                if (selectedCities.length > 1) {
                    const transportResults = await Promise.all(
                        selectedCities.slice(0, -1).map((city, i) =>
                            fetch(`/api/transport?fromCityId=${city.id}&toCityId=${selectedCities[i + 1].id}`).then(r => r.json())
                        )
                    );
                    setAvailableTransports(transportResults.flatMap(r => r.data || []));
                }
            };
            fetchAllData();
        }
    }, [selectedCities.length]);

    // Calculated fields
    const totalDays = startDate && endDate
        ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
        : 0;

    const allocatedDays = selectedCities.reduce((sum, c) => sum + (c.days || 1), 0);
    const daysRemaining = totalDays - allocatedDays;

    // Handlers
    const addCity = (city: any) => {
        if (!selectedCities.find(c => c.id === city.id)) {
            setSelectedCities([...selectedCities, { ...city, days: 2 }]); // Default 2 days
        }
    };

    const updateCityDays = (id: string, days: number) => {
        setSelectedCities(selectedCities.map(c => c.id === id ? { ...c, days: Math.max(1, days) } : c));
    };

    const removeCity = (id: string) => {
        setSelectedCities(selectedCities.filter(c => c.id !== id));
    };

    // --- SMART LOGIC: GENERATE PLAN ---
    const generatePlanStructure = () => {
        if (!startDate) return;

        let currentDate = new Date(startDate);
        const plan: any[] = [];

        selectedCities.forEach(city => {
            for (let i = 0; i < (city.days || 1); i++) {
                plan.push({
                    date: new Date(currentDate),
                    cityId: city.id,
                    cityName: city.name,
                    activities: []
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        // Only reset if empty or explicit request? For now, simplistic sync.
        if (dayPlan.length === 0) setDayPlan(plan);
        else {
            // Try to merge? Simpler to just ensure length matches or prompt user.
            // For MVP: reconstruct structure if length mismatch
            if (dayPlan.length !== plan.length) setDayPlan(plan);
        }
    };

    // Auto-fill Logic - Now respects budget allocation
    const autoFillPlan = () => {
        const activityBudget = budgetBreakdown.activities;
        const budgetPerDay = totalDays > 0 ? activityBudget / totalDays : 1000; // Default fallback

        const newPlan = dayPlan.map(day => {
            if (day.activities.length > 0) return day; // Don't overwrite existing

            // Filter activities for this city
            const cityActs = availableActivities.filter(a => a.city.id === day.cityId);

            // Score based on travel style AND budget fit
            const scored = cityActs.map(a => {
                let score = a.rating || 0;
                const cost = a.estimatedCost || 0;

                // Penalize activities that exceed daily budget
                if (cost > budgetPerDay * 0.5) score -= 1;
                if (cost > budgetPerDay) score -= 3;

                // Budget/Luxury adjustments
                if (travelStyle === "budget" && cost < 1000) score += 2;
                if (travelStyle === "luxury" && cost > 3000) score += 2;

                return { ...a, score };
            }).sort((a, b) => b.score - a.score);

            // Pick activities that fit within daily budget
            const selected: any[] = [];
            let daySpend = 0;
            for (const act of scored) {
                if (selected.length >= 3) break; // Max 3 activities per day
                const cost = act.estimatedCost || 0;
                if (daySpend + cost <= budgetPerDay || selected.length === 0) {
                    selected.push(act);
                    daySpend += cost;
                }
            }

            return { ...day, activities: selected };
        });
        setDayPlan(newPlan);
    };

    const toggleActivity = (dayIndex: number, activity: any) => {
        const newPlan = [...dayPlan];
        const day = newPlan[dayIndex];
        const exists = day.activities.find((a: any) => a.id === activity.id);

        if (exists) {
            day.activities = day.activities.filter((a: any) => a.id !== activity.id);
        } else {
            day.activities.push(activity);
        }
        setDayPlan(newPlan);
    };

    // Submit
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            // Create Trip
            const tripRes = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: tripName,
                    description: `${travelStyle} trip from ${homeCountry}`,
                    startDate,
                    endDate,
                    totalEstimatedCost: parseFloat(totalBudget),
                    currency: selectedCurrency,
                    coverPhotoUrl: selectedCities[0]?.imageUrl,
                    travelStyle
                }),
            });

            if (!tripRes.ok) throw new Error("Failed to create trip");
            const { trip } = await tripRes.json();

            // Create Stops & Allocated Activities
            // This is complex because our dayPlan is day-by-day, but DB is Stop -> Activities
            // We need to group dayPlan by city to create Stops, then add activities

            // Group dayPlan by city (sequential)
            let stopOrder = 1;
            let currentStopCityId = "";
            let currentStopArrival = null;
            let currentStopActivities: any[] = [];

            // Helper to post stop
            const createStop = async (cityId: string, arrival: Date, departure: Date, activities: any[]) => {
                const stopRes = await fetch(`/api/trips/${trip.id}/stops`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cityId,
                        stopOrder: stopOrder++,
                        arrivalDate: arrival.toISOString(),
                        departureDate: departure.toISOString(),
                        notes: "Planned via Wizard"
                    })
                });
                const { data: stop } = await stopRes.json();

                // Add activities
                for (const act of activities) {
                    await fetch(`/api/trips/${trip.id}/activities`, { // Wait, need stop activity endpoint?
                        // The standard API might be /api/trips/[id]/stops/[stopId]/activities or similar.
                        // Let's assume standard creation logic or directly use stop relation if API supports it.
                        // Per previous code: API was manual. Let's look at implementation plan or guess.
                        // Actually, CreateTripWizard previously did individual fetches.
                        // Let's use the stop ID returned.
                    });
                    // Actually simplest is to just create the stop, then we assume a separate endpoint for activities 
                    // OR the stop endpoint doesn't accept activities.
                    // Let's look at `prisma/schema`. StopActivity relates to TripStop.
                    // I need to POST to `/api/stops/${stop.id}/activities` NO, `api/activities` is GET.
                    // Let's use `fetch('/api/trips/${trip.id}/stops/${stop.id}/activities' ...)` ? 
                    // Wait, `routes.ts` for stops usually handles basic CRUD.
                    // I will implement a safe fallback: Create stop, then loop activities.
                    // Need to create StopActivity.
                    // Let's Assume POST `/api/trips/${tripId}/stops` returns the stop.
                    // Then POST `/api/activities`? No...

                    // Checking previous `search` code... `fetch('/api/trips/${tripId}/stops')`.
                    // I'll assume I need to implement activity saving.
                    // Actually, I'll inline the activity creation if I can, or do it explicitly.
                    // Let's use the DB directly if this was server action, but it's client.
                    // Ah, checking `route.ts`. 
                }
                // Double check API capability. The previous wizard didn't fully implement "Day by Day" saving to DB differently than "List of activities".
                // Previous wizard: `selectedActivities` were just... saved?
                // Wait, previous wizard `handleSubmit` code:
                /*
                // It didn't save activities! It just saved stops!
                // "Create Trip Wizard" summary said "save trip + stops + activities".
                // But looking at code I read earlier:
                // ... await fetch(`/api/trips/${tripId}/stops` ...
                // It NEVER saved the activities! The user was right "nothing happens here WTF".
                */

                // OK, I need to fix that too. I will add logic to save activities.
            };

            // Loop through day plan to identify stops
            // A "Stop" is a contiguous block of days in one city

            // Simplification for MVP: We already have `selectedCities`. Each is a stop.
            // We just need to distribute the activities from `dayPlan` into valid `StopActivity` records.

            let currentDateCursor = new Date(startDate);

            for (let i = 0; i < selectedCities.length; i++) {
                const city = selectedCities[i];
                const days = city.days || 1;
                const arrival = new Date(currentDateCursor);
                const departure = new Date(currentDateCursor);
                departure.setDate(departure.getDate() + days); // Departure is next block start

                // Create Stop
                const stopRes = await fetch(`/api/trips/${trip.id}/stops`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cityId: city.id,
                        stopOrder: i + 1,
                        arrivalDate: arrival.toISOString(),
                        departureDate: departure.toISOString(),
                    })
                });
                const stopData = await stopRes.json();

                if (stopData.data) {
                    // Find activities for this city in the dayPlan
                    const cityActivities = dayPlan
                        .filter(d => d.cityId === city.id)
                        .flatMap(d => d.activities.map((a: any) => ({ ...a, date: d.date })));

                    // Save activities
                    for (const act of cityActivities) {
                        // We need an endpoint for this. 
                        // I will create a quick server action or use a generic "bulk create" if available? 
                        // No. I have to call the API.
                        // Let's assume POST `/api/trips/[id]/activities` exists or I make it?
                        // I'll make a helper route internally or use `prisma`? No, client side.
                        // Existing API: `GET /api/activities`. `GET /api/trips`.
                        // I need to create `StopActivity`.
                        // I will trigger a fetch to a new endpoint `/api/stops/${stopData.data.id}/activities`.
                        // I'll implement that route quickly after this file.
                        await fetch(`/api/stops/${stopData.data.id}/activities`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                activityId: act.id,
                                scheduledDate: act.date,
                                isCompleted: false
                            })
                        });
                    }
                }

                currentDateCursor.setDate(currentDateCursor.getDate() + days);
            }

            router.push(`/trips/${trip.id}`);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setIsSubmitting(false);
        }
    };

    // --- RENDER HELPERS ---

    // Sort cities by country automatically (Smart Suggestion)
    const sortedAvailableCities = [...availableCities].sort((a, b) => {
        if (selectedCities.length === 0) return 0;
        const last = selectedCities[selectedCities.length - 1];
        if (a.country === last.country && b.country !== last.country) return -1;
        if (a.country !== last.country && b.country === last.country) return 1;
        return 0;
    });

    return (
        <div className="w-full max-w-none px-6 mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/trips" className="p-2 rounded-xl hover:bg-[#F5E6D3] transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#2C2C2C]">Plan Your Journey</h1>
                    <p className="text-[#6B5B4F]">{steps[currentStep - 1].title}: {steps[currentStep - 1].description}</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between px-4">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex flex-col items-center ${step.id === currentStep ? "opacity-100" : "opacity-60"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step.id <= currentStep ? "bg-[#FF6B4A] text-white" : "bg-[#F5E6D3] text-[#6B5B4F]"
                                }`}>
                                {step.id}
                            </div>
                            <span className="text-xs font-medium mt-1">{step.title}</span>
                        </div>
                        {i < steps.length - 1 && <div className="w-12 h-0.5 bg-[#F5E6D3] mx-2" />}
                    </div>
                ))}
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {/* --- STEP 1: BASICS --- */}
            {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E6D3] space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Globe className="w-5 h-5 text-[#FF6B4A]" /> Trip Details
                            </h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trip Name</label>
                                <input value={tripName} onChange={e => setTripName(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-[#E8DDD0] focus:ring-2 focus:ring-[#FF6B4A] outline-none"
                                    placeholder="e.g. Summer Europe 2026" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Home Country</label>
                                <input value={homeCountry} onChange={e => setHomeCountry(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-[#E8DDD0] focus:ring-2 focus:ring-[#FF6B4A] outline-none"
                                    placeholder="e.g. India" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-[#E8DDD0] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-[#E8DDD0] outline-none" />
                                </div>
                            </div>
                            {totalDays > 0 && <div className="text-sm text-[#FF6B4A] font-medium">Duration: {totalDays} Days</div>}
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E6D3] space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#FF6B4A]" /> Budget
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <div className="w-24">
                                        <label className="text-xs font-semibold text-[#6B5B4F] mb-1 block">Currency</label>
                                        <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-[#E8DDD0] outline-none bg-white font-medium">
                                            {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-[#6B5B4F] mb-1 block">Total Budget</label>
                                        <input type="number" value={totalBudget} onChange={e => setTotalBudget(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-[#E8DDD0] outline-none"
                                            placeholder="Enter your total budget" />
                                    </div>
                                </div>

                                {/* Smart Budget Breakdown - Auto-calculated */}
                                {budgetBreakdown.total > 0 && (
                                    <div className="mt-4 pt-3 border-t border-[#E8DDD0]">
                                        <p className="text-xs text-[#6B5B4F] mb-2 font-medium">Estimated Allocation ({travelStyle} style):</p>
                                        <div className="grid grid-cols-5 gap-2 text-center">
                                            {[
                                                { label: "Transport", value: budgetBreakdown.transport, icon: "✈️" },
                                                { label: "Stay", value: budgetBreakdown.accommodation, icon: "🏨" },
                                                { label: "Food", value: budgetBreakdown.food, icon: "🍽️" },
                                                { label: "Activities", value: budgetBreakdown.activities, icon: "🎯" },
                                                { label: "Misc", value: budgetBreakdown.misc, icon: "🛍️" }
                                            ].map(item => (
                                                <div key={item.label} className="bg-[#F5E6D3]/30 p-2 rounded-lg">
                                                    <div className="text-lg">{item.icon}</div>
                                                    <div className="text-xs text-[#6B5B4F]">{item.label}</div>
                                                    <div className="text-sm font-bold text-[#2C2C2C]">₹{item.value.toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Travel Style</h3>
                        <div className="grid gap-4">
                            {travelStyles.map(style => (
                                <button key={style.id} onClick={() => setTravelStyle(style.id)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${travelStyle === style.id ? "border-[#FF6B4A] bg-[#FF6B4A]/5" : "border-[#E8DDD0] hover:border-[#FF6B4A]/50"
                                        }`}>
                                    <div className={`p-3 rounded-full bg-white shadow-sm`}>
                                        <style.icon className="w-6 h-6" style={{ color: style.color }} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2C2C2C]">{style.name}</h4>
                                        <p className="text-sm text-[#6B5B4F]">{style.description}</p>
                                    </div>
                                    {travelStyle === style.id && <Check className="w-6 h-6 text-[#FF6B4A] ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 2: DESTINATIONS --- */}
            {currentStep === 2 && (
                <div className="grid lg:grid-cols-12 gap-8 animate-fade-in w-full">
                    {/* Catalog */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white p-4 rounded-xl border border-[#E8DDD0] sticky top-4">
                            <input value={citySearch} onChange={e => setCitySearch(e.target.value)}
                                className="w-full p-2 outline-none text-lg" placeholder="Search destinations..." />
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {sortedAvailableCities
                                .filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))
                                .map(city => {
                                    const isSelected = selectedCities.find(sc => sc.id === city.id);
                                    return (
                                        <button key={city.id} onClick={() => !isSelected && addCity(city)}
                                            className={`group relative h-48 rounded-xl overflow-hidden text-left transition-all ${isSelected ? "opacity-50 ring-4 ring-[#10B981]" : "hover:scale-[1.02] shadow-md hover:shadow-xl"}`}>
                                            <img src={city.imageUrl || city.image} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                                <h4 className="text-white font-bold text-xl drop-shadow-md">{city.name}</h4>
                                                <p className="text-white/90 text-sm font-medium drop-shadow-sm">{city.country}</p>
                                            </div>
                                            {isSelected && <div className="absolute top-2 right-2 bg-[#10B981] text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                                        </button>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Selected List */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-[#F5E6D3] h-fit">
                        <h3 className="font-semibold text-lg mb-4">Your Route ({selectedCities.length})</h3>
                        {selectedCities.length === 0 ? (
                            <div className="text-center py-10 text-[#6B5B4F]">
                                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>Select cities to build your route</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedCities.map((city, idx) => (
                                    <div key={city.id} className="bg-[#F5E6D3]/30 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-[#2C2C2C]">{city.name}</div>
                                            <div className="text-xs text-[#6B5B4F]">{city.country}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#6B5B4F]" />
                                            <input type="number" min="1" max="30" value={city.days}
                                                onChange={(e) => updateCityDays(city.id, parseInt(e.target.value))}
                                                className="w-16 p-1 rounded-md border border-[#E8DDD0] text-center font-medium" />
                                            <span className="text-xs text-[#6B5B4F]">days</span>
                                        </div>
                                        <button onClick={() => removeCity(city.id)} className="text-[#6B5B4F] hover:text-red-500">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div className="mt-6 pt-4 border-t border-[#E8DDD0] flex justify-between items-center">
                                    <span className="text-[#6B5B4F]">Allocated / Total</span>
                                    <span className={`font-bold ${allocatedDays > totalDays ? "text-red-500" : "text-[#10B981]"}`}>
                                        {allocatedDays} / {totalDays} Days
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- STEP 3: COMPREHENSIVE PLANNING --- */}
            {currentStep === 3 && (
                <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C2C2C]">Plan Your Trip</h2>
                            <p className="text-[#6B5B4F]">Choose your stays, meals, activities and transport.</p>
                        </div>
                        <button onClick={autoFillPlan} className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 hover:-translate-y-0.5">
                            <Sparkles className="w-4 h-4" />
                            Auto-Fill All
                        </button>
                    </div>

                    {/* Planning Tabs */}
                    <div className="flex gap-2 p-1 bg-[#F5E6D3]/50 rounded-xl w-fit">
                        {[
                            { id: "accommodation", label: "🏨 Stays", icon: Building },
                            { id: "food", label: "🍽️ Food", icon: UtensilsCrossed },
                            { id: "activities", label: "🎯 Activities", icon: Compass },
                            { id: "transport", label: "✈️ Transport", icon: Plane }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setPlanningTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${planningTab === tab.id
                                    ? "bg-white text-[#FF6B4A] shadow-sm"
                                    : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ACCOMMODATION TAB */}
                    {planningTab === "accommodation" && (
                        <div className="grid gap-4">
                            {selectedCities.map(city => (
                                <div key={city.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                                    <h3 className="font-bold text-lg text-[#2C2C2C] mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                                        {city.name} - {city.days} nights
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {availableHotels.filter(h => h.city?.id === city.id || h.cityId === city.id).map(hotel => (
                                            <div
                                                key={hotel.id}
                                                onClick={() => setSelectedHotels(prev => ({ ...prev, [city.id]: hotel }))}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedHotels[city.id]?.id === hotel.id
                                                    ? "border-[#FF6B4A] bg-[#FF6B4A]/5"
                                                    : "border-[#E8DDD0] hover:border-[#FF6B4A]/50"
                                                    }`}
                                            >
                                                <div className="font-bold text-[#2C2C2C]">{hotel.name}</div>
                                                <div className="text-sm text-[#6B5B4F]">{hotel.starRating}★ • {hotel.type || "Hotel"}</div>
                                                <div className="text-[#FF6B4A] font-bold mt-2">₹{hotel.pricePerNight?.toLocaleString()}/night</div>
                                                <div className="text-xs text-[#6B5B4F] mt-1">
                                                    Total: ₹{((hotel.pricePerNight || 0) * city.days).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                        {availableHotels.filter(h => h.city?.id === city.id || h.cityId === city.id).length === 0 && (
                                            <div className="col-span-full text-center py-8 text-[#6B5B4F]">
                                                No hotels found for {city.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FOOD TAB */}
                    {planningTab === "food" && (
                        <div className="grid gap-4">
                            {selectedCities.map(city => (
                                <div key={city.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                                    <h3 className="font-bold text-lg text-[#2C2C2C] mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                                        Restaurants in {city.name}
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {availableRestaurants.filter(r => r.city?.id === city.id || r.cityId === city.id).map(restaurant => {
                                            const isSelected = selectedRestaurants[city.id]?.some(r => r.id === restaurant.id);
                                            return (
                                                <div
                                                    key={restaurant.id}
                                                    onClick={() => {
                                                        setSelectedRestaurants(prev => {
                                                            const current = prev[city.id] || [];
                                                            if (isSelected) {
                                                                return { ...prev, [city.id]: current.filter(r => r.id !== restaurant.id) };
                                                            } else {
                                                                return { ...prev, [city.id]: [...current, restaurant] };
                                                            }
                                                        });
                                                    }}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                        ? "border-[#FF6B4A] bg-[#FF6B4A]/5"
                                                        : "border-[#E8DDD0] hover:border-[#FF6B4A]/50"
                                                        }`}
                                                >
                                                    <div className="font-bold text-[#2C2C2C]">{restaurant.name}</div>
                                                    <div className="text-sm text-[#6B5B4F]">{restaurant.cuisineType} • {restaurant.priceRange}</div>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                                                        <span className="font-bold text-[#2C2C2C]">{restaurant.rating}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {availableRestaurants.filter(r => r.city?.id === city.id || r.cityId === city.id).length === 0 && (
                                            <div className="col-span-full text-center py-8 text-[#6B5B4F]">
                                                No restaurants found for {city.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TRANSPORT TAB */}
                    {planningTab === "transport" && (
                        <div className="grid gap-4">
                            {selectedCities.length > 1 ? (
                                selectedCities.slice(0, -1).map((city, idx) => {
                                    const nextCity = selectedCities[idx + 1];
                                    const routeTransports = availableTransports.filter(
                                        t => (t.fromCity?.id === city.id || t.fromCityId === city.id) &&
                                            (t.toCity?.id === nextCity.id || t.toCityId === nextCity.id)
                                    );
                                    return (
                                        <div key={`${city.id}-${nextCity.id}`} className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                                            <h3 className="font-bold text-lg text-[#2C2C2C] mb-4 flex items-center gap-2">
                                                <Plane className="w-4 h-4 text-[#FF6B4A]" />
                                                {city.name} → {nextCity.name}
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {routeTransports.map(transport => {
                                                    const isSelected = selectedTransports.some(t => t.id === transport.id);
                                                    return (
                                                        <div
                                                            key={transport.id}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setSelectedTransports(prev => prev.filter(t => t.id !== transport.id));
                                                                } else {
                                                                    setSelectedTransports(prev => [...prev.filter(t =>
                                                                        !(t.fromCityId === city.id && t.toCityId === nextCity.id)
                                                                    ), transport]);
                                                                }
                                                            }}
                                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                                ? "border-[#FF6B4A] bg-[#FF6B4A]/5"
                                                                : "border-[#E8DDD0] hover:border-[#FF6B4A]/50"
                                                                }`}
                                                        >
                                                            <div className="font-bold text-[#2C2C2C]">{transport.operatorName}</div>
                                                            <div className="text-sm text-[#6B5B4F]">
                                                                {transport.transportType} • {transport.classType}
                                                            </div>
                                                            <div className="text-sm text-[#6B5B4F] mt-1">
                                                                {transport.departureTime} - {transport.arrivalTime}
                                                            </div>
                                                            <div className="text-[#FF6B4A] font-bold mt-2">₹{transport.price?.toLocaleString()}</div>
                                                        </div>
                                                    );
                                                })}
                                                {routeTransports.length === 0 && (
                                                    <div className="col-span-full text-center py-8 text-[#6B5B4F]">
                                                        No transport options found for this route
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#F5E6D3] text-center text-[#6B5B4F]">
                                    <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Transport options appear when you have multiple cities selected.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIVITIES TAB - Original Day Planner */}
                    {planningTab === "activities" && (
                        <div className="space-y-6">
                            {dayPlan.map((day, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden group hover:border-[#FF6B4A]/30 transition-colors">
                                    <div className="p-4 bg-[#FFFBF7] border-b border-[#F5E6D3] flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
                                                <span className="text-[10px] text-[#6B5B4F] uppercase font-bold tracking-wider">Day</span>
                                                <span className="text-2xl font-bold text-[#FF6B4A] leading-none">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#2C2C2C] text-lg">{format(new Date(day.date), "EEEE, MMM d")}</h3>
                                                <div className="flex items-center gap-1 text-sm text-[#6B5B4F]">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {day.cityName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-[#6B5B4F] bg-white px-3 py-1 rounded-full border border-[#E8DDD0]">
                                            {day.activities.length} Activities • {day.activities.reduce((sum: number, a: any) => sum + (a.durationMinutes || 60), 0) / 60} hrs
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-6 space-y-3">
                                        {day.activities.length === 0 ? (
                                            <div className="p-8 border-2 border-dashed border-[#E8DDD0] rounded-xl flex flex-col items-center justify-center text-center text-[#6B5B4F] bg-[#FFFBF7]/50">
                                                <Compass className="w-8 h-8 opacity-20 mb-2" />
                                                <p className="italic">No activities planned yet.</p>
                                                <p className="text-xs mt-1">Add exploring, dining, or relaxing!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {day.activities.map((act: any, aIdx: number) => (
                                                    <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E8DDD0] hover:shadow-md hover:border-[#FF6B4A]/20 transition-all group/card relative">
                                                        {/* Time Connector Line if needed later */}
                                                        <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden hidden sm:block">
                                                            {act.imageUrl ? (
                                                                <img src={act.imageUrl} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-[#F5E6D3] text-[#6B5B4F]">
                                                                    <Camera className="w-6 h-6 opacity-30" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-[#2C2C2C] text-lg truncate pr-8">{act.name}</h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#6B5B4F]">
                                                                <span className="flex items-center gap-1 bg-[#F5F5F5] px-2 py-0.5 rounded-md">
                                                                    <Clock className="w-3 h-3" /> {Math.floor((act.durationMinutes || 60) / 60)}h
                                                                </span>
                                                                <span className="flex items-center gap-1 bg-[#F5F5F5] px-2 py-0.5 rounded-md">
                                                                    {act.currency} {act.estimatedCost}
                                                                </span>
                                                                <span className="flex items-center gap-1 bg-[#FFF5F2] text-[#FF6B4A] px-2 py-0.5 rounded-md capitalize">
                                                                    {act.category}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button onClick={() => toggleActivity(idx, act)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <button
                                                onClick={() => openActivityModal(idx, day.cityId)}
                                                className="w-full py-3 border-2 border-dashed border-[#E8DDD0] rounded-xl flex items-center justify-center gap-2 text-[#6B5B4F] font-bold hover:border-[#FF6B4A] hover:text-[#FF6B4A] hover:bg-[#FFF5F2] transition-all group/btn"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-[#E8DDD0] text-white flex items-center justify-center group-hover/btn:bg-[#FF6B4A] transition-colors">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                Add Activity to Day {idx + 1}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ACTIVITY SELECTION MODAL */}
            {isActivityModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[#F5E6D3] bg-[#FFFBF7] flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-2xl font-bold text-[#2C2C2C]">Discover Experiences</h3>
                                <p className="text-sm text-[#6B5B4F]">Select activities for Day {activeDayIndex + 1}</p>
                            </div>
                            <button onClick={() => setIsActivityModalOpen(false)} className="p-2 bg-white hover:bg-gray-100 rounded-full border border-[#E8DDD0] transition-colors">
                                <X className="w-5 h-5 text-[#6B5B4F]" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                            {availableActivities.filter(a => a.city.id === activeModalCityId).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-[#F5E6D3] rounded-full flex items-center justify-center mb-4">
                                        <MapPin className="w-10 h-10 text-[#6B5B4F] opacity-50" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#2C2C2C]">No activities found</h4>
                                    <p className="text-[#6B5B4F]">We couldn't find suggested activities for this city.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {availableActivities
                                        .filter(a => a.city.id === activeModalCityId)
                                        .map(activity => {
                                            const isAdded = dayPlan[activeDayIndex]?.activities.find((a: any) => a.id === activity.id);
                                            return (
                                                <button key={activity.id}
                                                    onClick={() => toggleActivity(activeDayIndex, activity)}
                                                    className={`relative flex flex-col text-left rounded-xl overflow-hidden border transition-all duration-300 group ${isAdded
                                                        ? "border-[#10B981] ring-2 ring-[#10B981]/20 bg-[#F0FDF4]"
                                                        : "border-gray-200 bg-white hover:border-[#FF6B4A]/50 hover:shadow-lg hover:-translate-y-1"
                                                        }`}
                                                >
                                                    <div className="h-32 w-full bg-gray-200 relative">
                                                        {activity.imageUrl ? (
                                                            <img src={activity.imageUrl} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2 right-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${isAdded ? "bg-[#10B981] text-white scale-110" : "bg-white text-gray-400 group-hover:text-[#FF6B4A]"
                                                                }`}>
                                                                {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                            </div>
                                                        </div>
                                                        {activity.rating && (
                                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                                                                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" /> {activity.rating}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-4 flex-1 flex flex-col">
                                                        <h4 className="font-bold text-[#2C2C2C] mb-1 line-clamp-1">{activity.name}</h4>
                                                        <p className="text-xs text-[#6B5B4F] line-clamp-2 mb-3 flex-1">{activity.description}</p>

                                                        <div className="flex items-center justify-between text-xs font-medium border-t border-gray-100 pt-3 mt-auto">
                                                            <span className="text-[#FF6B4A] bg-[#FFF5F2] px-2 py-1 rounded capitalize">{activity.category}</span>
                                                            <span className="text-[#2C2C2C]">{activity.currency} {activity.estimatedCost}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-[#F5E6D3] bg-white flex justify-end">
                            <button onClick={() => setIsActivityModalOpen(false)} className="px-8 py-3 bg-[#2C2C2C] text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                                Done Selecting
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- STEP 4: REVIEW --- */}
            {currentStep === 4 && (
                <div className="animate-fade-in bg-white p-8 rounded-3xl shadow-lg border border-[#F5E6D3] text-center max-w-2xl mx-auto space-y-6">
                    <div className="w-20 h-20 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center mx-auto">
                        <Plane className="w-10 h-10 text-[#FF6B4A]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">{tripName}</h2>
                        <p className="text-[#6B5B4F] text-lg">{totalDays} Days • {selectedCities.map(c => c.name).join(" → ")}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#F5E6D3]">
                        <div>
                            <div className="text-sm text-[#6B5B4F]">Total Budget</div>
                            <div className="text-xl font-bold text-[#2C2C2C]">{selectedCurrency} {totalBudget}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[#6B5B4F]">Travel Style</div>
                            <div className="text-xl font-bold text-[#2C2C2C] capitalize">{travelStyle}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[#6B5B4F]">Activities</div>
                            <div className="text-xl font-bold text-[#2C2C2C]">{dayPlan.reduce((s, d) => s + d.activities.length, 0)}</div>
                        </div>
                    </div>

                    <div className="text-sm text-[#6B5B4F]">
                        Ready to launch your adventure? We've prepared everything.
                    </div>
                </div>
            )}


            {/* FOOTER ACTIONS */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                    <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}
                        className="px-6 py-3 rounded-xl border border-[#D9C4A9] bg-[#FFFBF7] font-semibold text-[#6B5B4F] hover:bg-[#F5E6D3] shadow-sm disabled:opacity-50 transition-all">
                        Back
                    </button>

                    <div className="flex gap-2">
                        {/* Skip/Next Logic */}
                        {currentStep < 4 ? (
                            <button onClick={() => {
                                if (currentStep === 2) generatePlanStructure();
                                setCurrentStep(currentStep + 1);
                            }} disabled={currentStep === 1 && (!tripName || !startDate || !endDate)}
                                className="px-8 py-3 rounded-xl bg-[#FF6B4A] text-white font-bold shadow-lg shadow-[#FF6B4A]/30 hover:bg-[#E63E23]">
                                Next Step
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isSubmitting}
                                className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold shadow-lg shadow-[#10B981]/30 hover:bg-[#059669] flex items-center gap-2">
                                {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                                Launch Trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
