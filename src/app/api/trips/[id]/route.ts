import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/trips/[id] - Get trip details with stops and budget
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

        const { id } = await params;

        const trip = await prisma.trip.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
            include: {
                stops: {
                    where: { deletedAt: null },
                    include: {
                        city: { select: { id: true, name: true, country: true, imageUrl: true, costIndex: true } },
                        activities: {
                            where: { deletedAt: null },
                            include: { activity: true },
                        },
                    },
                    orderBy: { stopOrder: "asc" },
                },
                budgets: { where: { deletedAt: null } },
            },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        // Calculate budget summary
        const budgetByCategory: Record<string, { estimated: number; actual: number }> = {};
        for (const b of trip.budgets) {
            budgetByCategory[b.category] = {
                estimated: b.estimatedAmount,
                actual: b.actualAmount || 0,
            };
        }

        // Calculate accommodation costs from stops
        const accommodationTotal = trip.stops.reduce((sum, s) => sum + (s.accommodationCost || 0), 0);

        // Calculate activity costs
        const activityTotal = trip.stops.reduce((sum, s) =>
            sum + s.activities.reduce((aSum, a) => aSum + (a.actualCost || a.activity.estimatedCost), 0), 0
        );

        return NextResponse.json({
            data: {
                id: trip.id,
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                status: trip.status,
                isPublic: trip.isPublic,
                coverPhotoUrl: trip.coverPhotoUrl,
                totalEstimatedCost: trip.totalEstimatedCost,
                currency: trip.currency,
                stops: trip.stops.map(s => ({
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
                        name: a.activity.name,
                        category: a.activity.category,
                        estimatedCost: a.activity.estimatedCost,
                        actualCost: a.actualCost,
                        scheduledDate: a.scheduledDate,
                        scheduledTime: a.scheduledTime,
                        isCompleted: a.isCompleted,
                    })),
                })),
                budgetSummary: {
                    byCategory: budgetByCategory,
                    accommodation: accommodationTotal,
                    activities: activityTotal,
                    total: trip.totalEstimatedCost,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching trip:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch trip" } },
            { status: 500 }
        );
    }
}

// PUT /api/trips/[id] - Update trip
export async function PUT(
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

        const { id } = await params;
        const body = await request.json();

        const existing = await prisma.trip.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
        });

        if (!existing) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        const trip = await prisma.trip.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                coverPhotoUrl: body.coverPhotoUrl,
                status: body.status,
                isPublic: body.isPublic,
                totalEstimatedCost: body.totalEstimatedCost,
            },
        });

        return NextResponse.json({ data: trip });
    } catch (error) {
        console.error("Error updating trip:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to update trip" } },
            { status: 500 }
        );
    }
}

// DELETE /api/trips/[id] - Soft delete trip
export async function DELETE(
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

        const { id } = await params;

        const existing = await prisma.trip.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
        });

        if (!existing) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        await prisma.trip.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return NextResponse.json({ message: "Trip deleted successfully" });
    } catch (error) {
        console.error("Error deleting trip:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to delete trip" } },
            { status: 500 }
        );
    }
}
