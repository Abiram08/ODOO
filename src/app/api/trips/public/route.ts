import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        // Fetch all public trips
        const trips = await prisma.trip.findMany({
            where: {
                isPublic: true,
                status: {
                    in: ["upcoming", "completed"]
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePhotoUrl: true
                    }
                },
                stops: {
                    include: {
                        city: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        });

        // Add computed fields
        const tripsWithDestinations = trips.map(trip => ({
            ...trip,
            destinations: trip.stops?.map(s => s.city?.name).filter(Boolean) || []
        }));

        return NextResponse.json({ data: tripsWithDestinations });
    } catch (error) {
        console.error("Failed to fetch public trips:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
