import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/trips/[id]/stops - Get all stops for a trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const { id: tripId } = await params;

        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId: session.user.id, deletedAt: null },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        const stops = await prisma.tripStop.findMany({
            where: { tripId, deletedAt: null },
            include: {
                city: { select: { id: true, name: true, country: true, imageUrl: true } },
                activities: {
                    include: { activity: true },
                    where: { deletedAt: null },
                },
            },
            orderBy: { stopOrder: "asc" },
        });

        return NextResponse.json({
            data: stops.map(s => ({
                id: s.id,
                stopOrder: s.stopOrder,
                city: s.city,
                arrivalDate: s.arrivalDate,
                departureDate: s.departureDate,
                accommodationName: s.accommodationName,
                accommodationCost: s.accommodationCost,
                notes: s.notes,
                activities: s.activities.map(a => ({
                    id: a.id,
                    activity: a.activity,
                    scheduledDate: a.scheduledDate,
                    scheduledTime: a.scheduledTime,
                    actualCost: a.actualCost,
                    isCompleted: a.isCompleted,
                })),
            })),
        });
    } catch (error) {
        console.error("Error fetching stops:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch stops" } },
            { status: 500 }
        );
    }
}

// POST /api/trips/[id]/stops - Add a stop to a trip
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const { id: tripId } = await params;
        const body = await request.json();

        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId: session.user.id, deletedAt: null },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        // Get next stop order
        const lastStop = await prisma.tripStop.findFirst({
            where: { tripId, deletedAt: null },
            orderBy: { stopOrder: "desc" },
        });
        const nextOrder = (lastStop?.stopOrder || 0) + 1;

        const stop = await prisma.tripStop.create({
            data: {
                tripId,
                cityId: body.cityId,
                stopOrder: body.stopOrder || nextOrder,
                arrivalDate: new Date(body.arrivalDate),
                departureDate: new Date(body.departureDate),
                accommodationName: body.accommodationName,
                accommodationCost: body.accommodationCost,
                notes: body.notes,
            },
            include: {
                city: { select: { id: true, name: true, country: true, imageUrl: true } },
            },
        });

        return NextResponse.json({ data: stop }, { status: 201 });
    } catch (error) {
        console.error("Error creating stop:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to create stop" } },
            { status: 500 }
        );
    }
}
