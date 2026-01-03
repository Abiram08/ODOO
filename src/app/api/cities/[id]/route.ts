import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/cities/[id] - Get city details with hotels, restaurants, activities
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const city = await prisma.city.findUnique({
            where: { id, deletedAt: null },
            include: {
                hotels: {
                    where: { deletedAt: null },
                    orderBy: { pricePerNight: "asc" },
                },
                restaurants: {
                    where: { deletedAt: null },
                    orderBy: { avgMealCost: "asc" },
                },
                activities: {
                    where: { deletedAt: null },
                    orderBy: { popularityScore: "desc" },
                },
                transportFrom: {
                    where: { deletedAt: null },
                    include: { toCity: { select: { id: true, name: true, country: true } } },
                    orderBy: { price: "asc" },
                },
                transportTo: {
                    where: { deletedAt: null },
                    include: { fromCity: { select: { id: true, name: true, country: true } } },
                    orderBy: { price: "asc" },
                },
            },
        });

        if (!city) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "City not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: {
                id: city.id,
                name: city.name,
                country: city.country,
                countryCode: city.countryCode,
                region: city.region,
                description: city.description,
                imageUrl: city.imageUrl,
                costIndex: city.costIndex,
                latitude: city.latitude,
                longitude: city.longitude,
                timezone: city.timezone,
                hotels: city.hotels.map(h => ({
                    id: h.id,
                    name: h.name,
                    category: h.category,
                    pricePerNight: h.pricePerNight,
                    rating: h.rating,
                    amenities: h.amenities ? JSON.parse(h.amenities) : [],
                    description: h.description,
                    imageUrl: h.imageUrl,
                })),
                restaurants: city.restaurants.map(r => ({
                    id: r.id,
                    name: r.name,
                    cuisineType: r.cuisineType,
                    priceRange: r.priceRange,
                    avgMealCost: r.avgMealCost,
                    rating: r.rating,
                    isVegetarian: r.isVegetarian,
                    description: r.description,
                })),
                activities: city.activities.map(a => ({
                    id: a.id,
                    name: a.name,
                    category: a.category,
                    estimatedCost: a.estimatedCost,
                    durationMinutes: a.durationMinutes,
                    rating: a.rating,
                    description: a.description,
                    imageUrl: a.imageUrl,
                })),
                transportFrom: city.transportFrom.map(t => ({
                    id: t.id,
                    toCity: t.toCity,
                    transportType: t.transportType,
                    operatorName: t.operatorName,
                    departureTime: t.departureTime,
                    arrivalTime: t.arrivalTime,
                    durationMinutes: t.durationMinutes,
                    price: t.price,
                    classType: t.classType,
                })),
                transportTo: city.transportTo.map(t => ({
                    id: t.id,
                    fromCity: t.fromCity,
                    transportType: t.transportType,
                    operatorName: t.operatorName,
                    departureTime: t.departureTime,
                    arrivalTime: t.arrivalTime,
                    durationMinutes: t.durationMinutes,
                    price: t.price,
                    classType: t.classType,
                })),
            }
        });
    } catch (error) {
        console.error("Error fetching city:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch city" } },
            { status: 500 }
        );
    }
}
