import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/trips/[id]/budgets - Get budget summary
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: tripId } = await params;
        const session = await auth();

        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                deletedAt: null,
                OR: [
                    { userId: session?.user?.id || "" },
                    { isPublic: true },
                ],
            },
            include: {
                budgets: { where: { deletedAt: null } },
                stops: {
                    where: { deletedAt: null },
                    include: {
                        activities: {
                            where: { deletedAt: null },
                            include: { activity: true },
                        },
                    },
                },
            },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        // Calculate totals
        const totalEstimated = trip.budgets.reduce((sum, b) => sum + b.estimatedAmount, 0);
        const totalActual = trip.budgets.reduce((sum, b) => sum + (b.actualAmount || 0), 0);

        // Calculate activity costs
        const activityCosts = trip.stops.flatMap((stop) =>
            stop.activities.map((a) => ({
                date: a.scheduledDate,
                cost: a.actualCost || a.activity.estimatedCost,
            }))
        );

        // Calculate trip duration
        const tripDays = Math.ceil(
            (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

        const perDayAverage = tripDays > 0 ? totalEstimated / tripDays : 0;

        // Check for over-budget categories
        const overBudgetCategories = trip.budgets
            .filter((b) => b.actualAmount && b.actualAmount > b.estimatedAmount * 1.2)
            .map((b) => b.category);

        return NextResponse.json({
            budgets: trip.budgets.map((b) => ({
                id: b.id,
                category: b.category,
                estimatedAmount: b.estimatedAmount,
                actualAmount: b.actualAmount,
                currency: b.currency,
                notes: b.notes,
            })),
            summary: {
                totalEstimated,
                totalActual,
                perDayAverage: Math.round(perDayAverage * 100) / 100,
                tripDays,
                overBudgetCategories,
            },
        });
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch budgets" } },
            { status: 500 }
        );
    }
}
