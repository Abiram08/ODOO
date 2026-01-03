import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/cities/popular - Get popular destinations
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

        const cities = await prisma.city.findMany({
            where: { deletedAt: null },
            orderBy: { popularityScore: "desc" },
            take: limit,
        });

        return NextResponse.json({
            cities: cities.map((city) => ({
                id: city.id,
                name: city.name,
                country: city.country,
                countryCode: city.countryCode,
                costIndex: city.costIndex,
                popularityScore: city.popularityScore,
                imageUrl: city.imageUrl,
                description: city.description,
            })),
        });
    } catch (error) {
        console.error("Error fetching popular cities:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch popular cities" } },
            { status: 500 }
        );
    }
}
