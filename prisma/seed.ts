
// ============================================================================
// GlobeTrotter - Database Seed File
// Complete seeding data for all travel planning categories
// ============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================================================
// CATEGORY 1: FLIGHTS DATA (Mapped to Transport)
// ============================================================================

const flightsData = [
    {
        transportType: "flight",
        operatorName: "IndiGo",
        // flightNumber: "6E123", // Stored in description or ignored? Let's use name/operator
        fromCityName: "Delhi",
        toCityName: "Mumbai",
        departureTime: "08:00",
        arrivalTime: "10:30",
        durationMinutes: 150,
        price: 4500,
        currency: "INR",
        classType: "economy",
        frequency: "daily",
        // Extras stored in JSON if needed, or ignored for strict schema
    },
    {
        transportType: "flight",
        operatorName: "Spicejet",
        fromCityName: "Bangalore",
        toCityName: "Goa",
        departureTime: "06:30",
        arrivalTime: "08:15",
        durationMinutes: 105,
        price: 3200,
        currency: "INR",
        classType: "economy",
        frequency: "daily",
    },
    {
        transportType: "flight",
        operatorName: "Air India",
        fromCityName: "Kolkata",
        toCityName: "Mumbai",
        departureTime: "14:00",
        arrivalTime: "16:45",
        durationMinutes: 165,
        price: 5200,
        currency: "INR",
        classType: "economy",
        frequency: "daily",
    },
];

// ============================================================================
// CATEGORY 2: HOTELS DATA
// ============================================================================

const hotelsData = [
    {
        name: "The Leela Palace Mumbai",
        cityName: "Mumbai",
        category: "luxury",
        description: "Iconic hotel in Worli",
        pricePerNight: 25000,
        currency: "INR",
        rating: 5.0,
        amenities: JSON.stringify(["Swimming Pool", "Spa", "Gym", "Fine Dining"]),
        address: "1 Xenia Street, Mumbai 400025",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        website: "https://www.theleela.com",
        contactPhone: "+91 22 6691 1234"
    },
    {
        name: "Taj Beachside Resort",
        cityName: "Goa",
        category: "luxury",
        description: "Beachfront luxury resort",
        pricePerNight: 12000,
        currency: "INR",
        rating: 4.5,
        amenities: JSON.stringify(["Beach Access", "Water Sports", "Spa"]),
        address: "Baga Beach Road, Goa 403516",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000",
    },
    {
        name: "Budget Inn Delhi",
        cityName: "Delhi",
        category: "budget",
        description: "Affordable stay in Khan Market",
        pricePerNight: 2500,
        currency: "INR",
        rating: 3.5,
        amenities: JSON.stringify(["WiFi", "Restaurant", "24H Front Desk"]),
        address: "32 Khan Market, New Delhi 110003",
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000",
    },
];

// ============================================================================
// CATEGORY 3: ATTRACTIONS (Mapped to Activity)
// ============================================================================

const activitiesData = [
    {
        name: "Christ the Redeemer",
        cityName: "Rio de Janeiro",
        category: "sightseeing",
        description: "Iconic statue overlooking the city",
        estimatedCost: 28, // USD
        currency: "USD",
        durationMinutes: 180,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1596395345917-48a0fa25e4c0?q=80&w=2070",
    },
    {
        name: "Anjuna Flea Market",
        cityName: "Goa",
        category: "shopping",
        description: "Famous flea market with unique souvenirs",
        estimatedCost: 0,
        currency: "INR",
        durationMinutes: 180,
        rating: 4.2,
        imageUrl: "https://images.unsplash.com/photo-1543058862-2b21c4b12282?q=80&w=2070",
    },
    {
        name: "Taj Mahal",
        cityName: "Agra",
        category: "culture", // HISTORICAL -> culture
        description: "World's most iconic monument",
        estimatedCost: 250,
        currency: "INR",
        durationMinutes: 120,
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2070",
    },
    {
        name: "Monkey Beach Diving",
        cityName: "Goa",
        category: "adventure", // ACTIVITY -> adventure
        description: "Professional PADI-certified scuba diving",
        estimatedCost: 3500,
        currency: "INR",
        durationMinutes: 240,
        rating: 4.6,
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070",
    },
];

// ============================================================================
// CATEGORY 4: WEATHER DATA
// ============================================================================

const weatherData = [
    {
        city: "Goa",
        date: "2026-02-15",
        current: { temperature: 32, humidity: 65, windSpeed: 12, condition: "SUNNY", feelsLike: 35, uvIndex: 8 },
        forecast: { high: 33, low: 24, precipitation: 0, condition: "SUNNY", chanceOfRain: 5 },
        hourlyForecast: [
            { time: "08:00", temperature: 24, condition: "CLEAR" },
            { time: "12:00", temperature: 32, condition: "SUNNY" },
            { time: "16:00", temperature: 30, condition: "SUNNY" },
            { time: "20:00", temperature: 26, condition: "CLEAR" }
        ],
        recommendation: "Perfect beach weather. Use sunscreen (SPF 50+)",
    },
    {
        city: "Delhi",
        date: "2026-02-15",
        current: { temperature: 18, humidity: 45, windSpeed: 8, condition: "CLOUDY", feelsLike: 16, uvIndex: 3 },
        forecast: { high: 22, low: 12, precipitation: 0, condition: "PARTLY_CLOUDY", chanceOfRain: 10 },
        hourlyForecast: [
            { time: "08:00", temperature: 12, condition: "CLEAR" },
            { time: "12:00", temperature: 20, condition: "PARTLY_CLOUDY" },
            { time: "16:00", temperature: 22, condition: "CLOUDY" },
            { time: "20:00", temperature: 14, condition: "CLEAR" }
        ],
        recommendation: "Carry light jacket for evening.",
    },
];

// ============================================================================
// CATEGORY 5: RESTAURANTS
// ============================================================================

const restaurantsData = [
    {
        name: "The Fishery Goa",
        cityName: "Goa",
        cuisineType: "Seafood",
        priceRange: "mid",
        avgMealCost: 1500,
        currency: "INR",
        rating: 4.6,
        description: "Fresh seafood in Panjim",
        isVegetarian: false,
        imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070",
    },
    {
        name: "India Gate Restaurant",
        cityName: "Delhi",
        cuisineType: "North Indian",
        priceRange: "budget",
        avgMealCost: 800,
        currency: "INR",
        rating: 4.3,
        description: "Classic North Indian cuisine",
        isVegetarian: false,
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
    },
];

// ============================================================================
// CATEGORY 6: GUIDES
// ============================================================================

const guidesData = [
    {
        name: "Rajesh Kumar",
        specialization: "DIVING",
        city: "Goa",
        languages: JSON.stringify(["English", "Hindi", "Spanish"]),
        certification: "PADI Master Instructor",
        yearsOfExperience: 12,
        rating: 4.9,
        reviews: 234,
        pricePerDay: JSON.stringify({ amount: 2500, currency: "INR" }),
        availability: JSON.stringify({ from: "2026-02-01", to: "2026-05-31", daysPerWeek: 5 }),
        groupSize: JSON.stringify({ min: 2, max: 8 }),
        skills: JSON.stringify(["Scuba Diving", "Snorkeling", "Water Safety"]),
        tours: JSON.stringify([{ name: "Beginner Dive", price: 3500 }, { name: "Advanced Dive", price: 5000 }]),
    },
    {
        name: "Priya Sharma",
        specialization: "FOOD_WALKING_TOUR",
        city: "Goa",
        languages: JSON.stringify(["English", "Hindi", "Marathi"]),
        certification: "Food Tourism Expert",
        yearsOfExperience: 8,
        rating: 4.8,
        reviews: 156,
        pricePerDay: JSON.stringify({ amount: 1500, currency: "INR" }),
        availability: JSON.stringify({ from: "2026-01-01", to: "2026-12-31", daysPerWeek: 6 }),
        groupSize: JSON.stringify({ min: 2, max: 12 }),
        skills: JSON.stringify(["Local Cuisine Knowledge", "Cooking Class Facilitation"]),
        tours: JSON.stringify([{ name: "Street Food Walk", price: 1200 }, { name: "Fine Dining", price: 2500 }]),
    },
];

// ============================================================================
// EVENTS & OTHERS
// ============================================================================

const eventsData = [
    { name: "Holi Festival", city: "Delhi", country: "India", startDate: "2026-03-14", endDate: "2026-03-15", description: "Festival of Colors", category: "CULTURAL", expectedCrowd: "VERY_HIGH", entryFee: 0, highlights: JSON.stringify(["Color throwing", "Music"]), bestLocations: JSON.stringify(["Connaught Place"]), tips: JSON.stringify(["Wear old clothes"]) },
    { name: "Goa Carnival", city: "Goa", country: "India", startDate: "2026-02-22", endDate: "2026-02-24", description: "Parades and music", category: "CULTURAL", expectedCrowd: "HIGH", entryFee: 0, highlights: JSON.stringify(["Parades", "Food stalls"]), bestLocations: JSON.stringify(["Panjim"]), tips: JSON.stringify(["Stay hydrated"]) },
];

const costOfLivingData = [
    { city: "Goa", country: "India", category: "BUDGET", dailyCost: JSON.stringify({ accommodation: 1500, food: 800, total: 3300 }), weeklyTotalEstimate: 23100, monthlyTotalEstimate: 99000, costBreakdown: JSON.stringify({ meals: { lunch: 300 }, accommodation: { hostel: 800 } }) },
    { city: "Delhi", country: "India", category: "BUDGET", dailyCost: JSON.stringify({ accommodation: 2000, food: 600, total: 4000 }), weeklyTotalEstimate: 28000, monthlyTotalEstimate: 120000, costBreakdown: JSON.stringify({ meals: { lunch: 250 }, accommodation: { hostel: 1500 } }) },
];

const crowdData = [
    { location: "Anjuna Beach, Goa", date: "2026-02-15", hourlyData: JSON.stringify([{ hour: 9, level: "MODERATE" }, { hour: 12, level: "CROWDED" }]), seasonalFactor: JSON.stringify({ season: "PEAK", multiplier: 1.8 }), bestTimeToVisit: "EARLY_MORNING", avgWaitTime: 15 },
];

const currencyData = [
    { date: "2026-02-15", baseCurrency: "USD", rates: JSON.stringify({ INR: 83.25, EUR: 0.92, GBP: 0.79 }) },
];


async function main() {
    console.log("🌍 Starting GlobeTrotter Database Seeding...");

    try {
        // 0. Create Demo User
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Ensure user role exists
        const userRole = await prisma.role.upsert({
            where: { name: "user" },
            update: {},
            create: { name: "user", description: "Standard user role" }
        });

        const demoUser = await prisma.user.upsert({
            where: { email: "demo@globetrotter.com" },
            update: {},
            create: {
                email: "demo@globetrotter.com",
                name: "Demo User",
                password: hashedPassword,
                emailVerified: new Date(),
                userRoles: {
                    create: { roleId: userRole.id }
                }
            }
        });
        console.log(`✅ Demo user ready: demo@globetrotter.com / password123`);

        // 1. Ensure Cities Exist
        const citiesSet = new Set<string>();
        flightsData.forEach(f => { citiesSet.add(f.fromCityName); citiesSet.add(f.toCityName); });
        hotelsData.forEach(h => citiesSet.add(h.cityName));
        activitiesData.forEach(a => citiesSet.add(a.cityName));
        restaurantsData.forEach(r => citiesSet.add(r.cityName));
        // Also from other data sources if needed, but these cover the major ones linked by relation

        const cityMap = new Map<string, string>(); // Name -> ID

        for (const cityName of citiesSet) {
            // Simple default coordinates/country per city just to ensure creation
            let country = "India";
            if (cityName === "Rio de Janeiro") country = "Brazil";

            const city = await prisma.city.upsert({
                where: { name_country: { name: cityName, country } },
                update: {},
                create: {
                    name: cityName,
                    country,
                    countryCode: country === "India" ? "IN" : "BR",
                    latitude: 0, // Placeholder
                    longitude: 0, // Placeholder
                    description: `Beautiful city of ${cityName}`,
                    costIndex: 100,
                    popularityScore: 100
                }
            });
            cityMap.set(cityName, city.id);
            console.log(`✅ Secured City: ${cityName}`);
        }

        // 2. Seed Transport (Flight)
        for (const f of flightsData) {
            const fromId = cityMap.get(f.fromCityName);
            const toId = cityMap.get(f.toCityName);
            if (fromId && toId) {
                await prisma.transport.create({
                    data: {
                        transportType: f.transportType,
                        operatorName: f.operatorName,
                        fromCityId: fromId,
                        toCityId: toId,
                        departureTime: f.departureTime,
                        arrivalTime: f.arrivalTime,
                        durationMinutes: f.durationMinutes,
                        price: f.price,
                        currency: f.currency,
                        classType: f.classType,
                        frequency: f.frequency
                    }
                });
            }
        }
        console.log(`✅ Seeded ${flightsData.length} Flights`);

        // 3. Seed Hotels
        for (const h of hotelsData) {
            const cityId = cityMap.get(h.cityName);
            if (cityId) {
                await prisma.hotel.create({
                    data: {
                        name: h.name,
                        cityId: cityId,
                        category: h.category,
                        description: h.description,
                        pricePerNight: h.pricePerNight,
                        currency: h.currency,
                        rating: h.rating,
                        amenities: h.amenities,
                        address: h.address,
                        imageUrl: h.imageUrl,
                        contactPhone: h.contactPhone,
                        website: h.website
                    }
                });
            }
        }
        console.log(`✅ Seeded ${hotelsData.length} Hotels`);

        // 4. Seed Activities
        for (const a of activitiesData) {
            const cityId = cityMap.get(a.cityName);
            if (cityId) {
                await prisma.activity.create({
                    data: {
                        name: a.name,
                        cityId: cityId,
                        category: a.category,
                        description: a.description,
                        estimatedCost: a.estimatedCost,
                        currency: a.currency,
                        durationMinutes: a.durationMinutes,
                        rating: a.rating,
                        imageUrl: a.imageUrl
                    }
                });
            }
        }
        console.log(`✅ Seeded ${activitiesData.length} Activities`);

        // 5. Seed Restaurants
        for (const r of restaurantsData) {
            const cityId = cityMap.get(r.cityName);
            if (cityId) {
                await prisma.restaurant.create({
                    data: {
                        name: r.name,
                        cityId: cityId,
                        cuisineType: r.cuisineType,
                        priceRange: r.priceRange,
                        avgMealCost: r.avgMealCost,
                        currency: r.currency,
                        rating: r.rating,
                        description: r.description,
                        isVegetarian: r.isVegetarian,
                        imageUrl: r.imageUrl
                    }
                });
            }
        }
        console.log(`✅ Seeded ${restaurantsData.length} Restaurants`);

        // 6. Seed Standalone Tables
        for (const w of weatherData) {
            const cityId = cityMap.get(w.city);
            await prisma.weather.create({
                data: {
                    city: w.city,
                    cityId: cityId,
                    date: w.date,
                    current: JSON.stringify(w.current),
                    forecast: JSON.stringify(w.forecast),
                    hourlyForecast: JSON.stringify(w.hourlyForecast),
                    recommendation: w.recommendation
                }
            });
        }

        for (const g of guidesData) {
            const cityId = cityMap.get(g.city);
            await prisma.guide.create({
                data: {
                    name: g.name,
                    specialization: g.specialization,
                    city: g.city,
                    cityId: cityId,
                    languages: g.languages,
                    certification: g.certification,
                    yearsOfExperience: g.yearsOfExperience,
                    rating: g.rating,
                    reviews: g.reviews,
                    pricePerDay: g.pricePerDay,
                    availability: g.availability,
                    groupSize: g.groupSize,
                    skills: g.skills,
                    tours: g.tours
                }
            });
        }

        for (const e of eventsData) {
            await prisma.event.create({
                data: {
                    name: e.name,
                    city: e.city,
                    country: e.country,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    description: e.description,
                    category: e.category,
                    expectedCrowd: e.expectedCrowd,
                    entryFee: e.entryFee,
                    highlights: e.highlights,
                    bestLocations: e.bestLocations,
                    tips: e.tips
                }
            });
        }

        for (const c of costOfLivingData) {
            await prisma.costOfLiving.create({
                data: {
                    city: c.city,
                    country: c.country,
                    category: c.category,
                    dailyCost: c.dailyCost,
                    weeklyTotalEstimate: c.weeklyTotalEstimate,
                    monthlyTotalEstimate: c.monthlyTotalEstimate,
                    costBreakdown: c.costBreakdown
                }
            });
        }

        for (const cr of crowdData) {
            await prisma.crowd.create({
                data: {
                    location: cr.location,
                    date: cr.date,
                    hourlyData: cr.hourlyData,
                    seasonalFactor: cr.seasonalFactor,
                    bestTimeToVisit: cr.bestTimeToVisit,
                    avgWaitTime: cr.avgWaitTime
                }
            });
        }

        for (const cur of currencyData) {
            await prisma.currency.create({
                data: {
                    date: cur.date,
                    baseCurrency: cur.baseCurrency,
                    rates: cur.rates
                }
            });
        }

        console.log("✅ All detailed seed data populated successfully!");

    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
