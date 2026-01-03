import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/activities - Search activities by city
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cityId = searchParams.get("cityId");
        const category = searchParams.get("category"); // sightseeing, food, adventure, culture, shopping, etc.
        const maxCost = parseFloat(searchParams.get("maxCost") || "999999");

        const where: any = { deletedAt: null };

        if (cityId) where.cityId = cityId;
        if (category) where.category = category;
        where.estimatedCost = { lte: maxCost };

        const activities = await prisma.activity.findMany({
            where,
            include: {
                city: { select: { id: true, name: true, country: true } },
            },
            orderBy: { popularityScore: "desc" },
        });

        return NextResponse.json({
            data: activities.map(a => ({
                id: a.id,
                name: a.name,
                category: a.category,
                estimatedCost: a.estimatedCost,
                currency: a.currency,
                durationMinutes: a.durationMinutes,
                durationFormatted: a.durationMinutes ? `${Math.floor(a.durationMinutes / 60)}h ${a.durationMinutes % 60}m` : null,
                rating: a.rating,
                description: a.description,
                imageUrl: a.imageUrl,
                city: a.city,
            })),
            count: activities.length,
        });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch activities" } },
            { status: 500 }
        );
    }
}
