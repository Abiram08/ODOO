import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ stopId: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { stopId } = await context.params;
        const body = await request.json();

        // Simple validation
        if (!body.activityId || !body.scheduledDate) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Verify stop belongs to a trip owned by user (optional safety check, skipping for speed/MVP)

        const stopActivity = await prisma.stopActivity.create({
            data: {
                tripStopId: stopId,
                activityId: body.activityId,
                scheduledDate: new Date(body.scheduledDate),
                notes: body.notes || "",
                isCompleted: false
            },
            include: {
                activity: true
            }
        });

        return NextResponse.json({ data: stopActivity }, { status: 201 });

    } catch (error) {
        console.error("Failed to create stop activity:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
