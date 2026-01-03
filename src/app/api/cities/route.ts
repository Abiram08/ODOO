import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/cities - List all cities with optional search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const country = searchParams.get("country");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

        const where: any = { deletedAt: null };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { country: { contains: search } },
                { region: { contains: search } },
            ];
        }

        if (country) {
            where.country = country;
        }

        const cities = await prisma.city.findMany({
            where,
            include: {
                _count: {
                    select: {
                        hotels: true,
                        restaurants: true,
                        activities: true,
                    }
                }
            },
            orderBy: { popularityScore: "desc" },
            take: limit,
        });

        return NextResponse.json({
            data: cities.map(city => ({
                id: city.id,
                name: city.name,
                country: city.country,
                countryCode: city.countryCode,
                region: city.region,
                description: city.description,
                imageUrl: city.imageUrl,
                costIndex: city.costIndex,
                popularityScore: city.popularityScore,
                hotelCount: city._count.hotels,
                restaurantCount: city._count.restaurants,
                activityCount: city._count.activities,
            }))
        });
    } catch (error) {
        console.error("Error fetching cities:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch cities" } },
            { status: 500 }
        );
    }
}
