import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createShareSchema } from "@/lib/validations";
import { v4 as uuidv4 } from "uuid";

// POST /api/trips/[id]/share - Create share link
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: tripId } = await params;
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId: session.user.id, deletedAt: null },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        const body = await request.json();
        const parsed = createShareSchema.safeParse(body);

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

        const { shareType, sharedWithEmail, expiresAt } = parsed.data;
        const shareToken = uuidv4().replace(/-/g, "") + uuidv4().replace(/-/g, "").slice(0, 32);

        const share = await prisma.tripShare.create({
            data: {
                tripId,
                shareToken,
                shareType,
                sharedWithEmail,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const publicUrl = `${baseUrl}/share/${shareToken}`;

        return NextResponse.json(
            {
                share: {
                    id: share.id,
                    shareToken: share.shareToken,
                    shareType: share.shareType,
                    publicUrl,
                    expiresAt: share.expiresAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating share:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to create share" } },
            { status: 500 }
        );
    }
}

// GET /api/trips/[id]/share - List shares for a trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: tripId } = await params;
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId: session.user.id, deletedAt: null },
        });

        if (!trip) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Trip not found" } },
                { status: 404 }
            );
        }

        const shares = await prisma.tripShare.findMany({
            where: { tripId, deletedAt: null },
            orderBy: { createdAt: "desc" },
        });

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        return NextResponse.json({
            shares: shares.map((s) => ({
                id: s.id,
                shareToken: s.shareToken,
                shareType: s.shareType,
                publicUrl: `${baseUrl}/share/${s.shareToken}`,
                viewCount: s.viewCount,
                lastViewedAt: s.lastViewedAt,
                expiresAt: s.expiresAt,
                createdAt: s.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching shares:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch shares" } },
            { status: 500 }
        );
    }
}
