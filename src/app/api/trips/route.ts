import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTripSchema } from "@/lib/validations";

// GET /api/trips - List user's trips
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
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const status = searchParams.get("status");

        const where = {
            userId: session.user.id,
            deletedAt: null,
            ...(status && { status }),
        };

        const [trips, total] = await Promise.all([
            prisma.trip.findMany({
                where,
                include: {
                    stops: {
                        include: { city: true },
                        orderBy: { stopOrder: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.trip.count({ where }),
        ]);

        return NextResponse.json({
            data: trips.map((trip) => ({
                id: trip.id,
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                status: trip.status,
                isPublic: trip.isPublic,
                totalEstimatedCost: trip.totalEstimatedCost,
                currency: trip.currency,
                coverPhotoUrl: trip.coverPhotoUrl,
                stopCount: trip.stops.length,
                cities: trip.stops.map((s) => s.city.name),
            })),
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
        });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch trips" } },
            { status: 500 }
        );
    }
}

// POST /api/trips - Create new trip
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parsed = createTripSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid input data",
                        details: parsed.error.errors.map((e) => ({
                            field: e.path.join("."),
                            message: e.message,
                        })),
                    },
                },
                { status: 400 }
            );
        }

        const { name, description, startDate, endDate, coverPhotoUrl, totalEstimatedCost, currency } = parsed.data;

        // Validate date range
        if (new Date(endDate) < new Date(startDate)) {
            return NextResponse.json(
                {
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "End date must be after start date",
                    },
                },
                { status: 400 }
            );
        }

        const trip = await prisma.trip.create({
            data: {
                userId: session.user.id,
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                coverPhotoUrl,
                totalEstimatedCost: totalEstimatedCost || 0,
                currency: currency || "INR",
                status: "draft",
            },
        });

        return NextResponse.json({ trip }, { status: 201 });
    } catch (error) {
        console.error("Error creating trip:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to create trip" } },
            { status: 500 }
        );
    }
}
