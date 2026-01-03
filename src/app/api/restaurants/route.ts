import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/restaurants - Search restaurants by city
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cityId = searchParams.get("cityId");
        const cuisineType = searchParams.get("cuisine");
        const priceRange = searchParams.get("priceRange"); // budget, mid, fine_dining
        const vegetarianOnly = searchParams.get("vegetarian") === "true";

        const where: any = { deletedAt: null };

        if (cityId) where.cityId = cityId;
        if (cuisineType) where.cuisineType = cuisineType;
        if (priceRange) where.priceRange = priceRange;
        if (vegetarianOnly) where.isVegetarian = true;

        const restaurants = await prisma.restaurant.findMany({
            where,
            include: {
                city: { select: { id: true, name: true, country: true } },
            },
            orderBy: { avgMealCost: "asc" },
        });

        return NextResponse.json({
            data: restaurants.map(r => ({
                id: r.id,
                name: r.name,
                cuisineType: r.cuisineType,
                priceRange: r.priceRange,
                avgMealCost: r.avgMealCost,
                currency: r.currency,
                rating: r.rating,
                isVegetarian: r.isVegetarian,
                description: r.description,
                address: r.address,
                imageUrl: r.imageUrl,
                city: r.city,
            })),
            count: restaurants.length,
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch restaurants" } },
            { status: 500 }
        );
    }
}
