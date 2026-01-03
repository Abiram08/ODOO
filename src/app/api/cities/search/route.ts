import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { citySearchSchema } from "@/lib/validations";

// GET /api/cities/search - Search cities
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
        const parsed = citySearchSchema.safeParse({
            q: searchParams.get("q"),
            countryCode: searchParams.get("countryCode"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "Invalid search parameters" } },
                { status: 400 }
            );
        }

        const { q, countryCode, page, limit } = parsed.data;

        const where = {
            deletedAt: null,
            ...(q && {
                OR: [
                    { name: { contains: q } },
                    { country: { contains: q } },
                ],
            }),
            ...(countryCode && { countryCode }),
        };

        const [cities, total] = await Promise.all([
            prisma.city.findMany({
                where,
                orderBy: { popularityScore: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.city.count({ where }),
        ]);

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
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
        });
    } catch (error) {
        console.error("Error searching cities:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to search cities" } },
            { status: 500 }
        );
    }
}
