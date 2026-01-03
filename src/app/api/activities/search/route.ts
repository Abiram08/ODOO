import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { activitySearchSchema } from "@/lib/validations";

// GET /api/activities/search - Search activities
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const parsed = activitySearchSchema.safeParse({
            q: searchParams.get("q"),
            cityId: searchParams.get("cityId"),
            category: searchParams.get("category"),
            minCost: searchParams.get("minCost"),
            maxCost: searchParams.get("maxCost"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "Invalid search parameters" } },
                { status: 400 }
            );
        }

        const { q, cityId, category, minCost, maxCost, page, limit } = parsed.data;

        const where = {
            deletedAt: null,
            ...(q && { name: { contains: q } }),
            ...(cityId && { cityId }),
            ...(category && { category }),
            ...(minCost !== undefined && { estimatedCost: { gte: minCost } }),
            ...(maxCost !== undefined && { estimatedCost: { lte: maxCost } }),
        };

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where,
                include: {
                    city: {
                        select: { id: true, name: true, country: true },
                    },
                },
                orderBy: { popularityScore: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.activity.count({ where }),
        ]);

        return NextResponse.json({
            activities: activities.map((activity) => ({
                id: activity.id,
                name: activity.name,
                category: activity.category,
                description: activity.description,
                estimatedCost: activity.estimatedCost,
                currency: activity.currency,
                durationMinutes: activity.durationMinutes,
                rating: activity.rating,
                imageUrl: activity.imageUrl,
                city: activity.city,
            })),
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
        });
    } catch (error) {
        console.error("Error searching activities:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to search activities" } },
            { status: 500 }
        );
    }
}
