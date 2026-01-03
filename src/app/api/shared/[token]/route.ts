import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/shared/[token] - Get shared trip (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        const share = await prisma.tripShare.findFirst({
            where: {
                shareToken: token,
                deletedAt: null,
            },
            include: {
                trip: {
                    include: {
                        user: {
                            select: { id: true, fullName: true, profilePhotoUrl: true },
                        },
                        stops: {
                            where: { deletedAt: null },
                            include: {
                                city: true,
                                activities: {
                                    where: { deletedAt: null },
                                    include: { activity: true },
                                    orderBy: [{ scheduledDate: "asc" }, { scheduledTime: "asc" }],
                                },
                            },
                            orderBy: { stopOrder: "asc" },
                        },
                        budgets: { where: { deletedAt: null } },
                    },
                },
            },
        });

        if (!share || share.trip.deletedAt) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Shared trip not found" } },
                { status: 404 }
            );
        }

        // Check if share has expired
        if (share.expiresAt && new Date() > share.expiresAt) {
            return NextResponse.json(
                { error: { code: "SHARE_EXPIRED", message: "This share link has expired" } },
                { status: 410 }
            );
        }

        // Update view count and last viewed
        await prisma.tripShare.update({
            where: { id: share.id },
            data: {
                viewCount: { increment: 1 },
                lastViewedAt: new Date(),
            },
        });

        const { trip } = share;

        return NextResponse.json({
            trip: {
                id: trip.id,
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                coverPhotoUrl: trip.coverPhotoUrl,
                totalEstimatedCost: trip.totalEstimatedCost,
                currency: trip.currency,
                user: trip.user,
                stops: trip.stops.map((stop) => ({
                    id: stop.id,
                    city: stop.city,
                    stopOrder: stop.stopOrder,
                    arrivalDate: stop.arrivalDate,
                    departureDate: stop.departureDate,
                    accommodationName: stop.accommodationName,
                    activities: stop.activities.map((a) => ({
                        id: a.id,
                        activity: a.activity,
                        scheduledDate: a.scheduledDate,
                        scheduledTime: a.scheduledTime,
                    })),
                })),
                budgets: trip.budgets.map((b) => ({
                    category: b.category,
                    estimatedAmount: b.estimatedAmount,
                })),
            },
            shareInfo: {
                viewCount: share.viewCount + 1,
                createdAt: share.createdAt,
            },
        });
    } catch (error) {
        console.error("Error fetching shared trip:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch shared trip" } },
            { status: 500 }
        );
    }
}
