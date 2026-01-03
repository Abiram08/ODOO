import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/transport/search - Search transport routes between cities
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fromCityId = searchParams.get("from");
        const toCityId = searchParams.get("to");
        const type = searchParams.get("type"); // flight, train, bus

        if (!fromCityId || !toCityId) {
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "from and to city IDs required" } },
                { status: 400 }
            );
        }

        const where: any = {
            fromCityId,
            toCityId,
            deletedAt: null,
        };

        if (type) {
            where.transportType = type;
        }

        const routes = await prisma.transport.findMany({
            where,
            include: {
                fromCity: { select: { id: true, name: true, country: true, imageUrl: true } },
                toCity: { select: { id: true, name: true, country: true, imageUrl: true } },
            },
            orderBy: { price: "asc" },
        });

        return NextResponse.json({
            data: routes.map(r => ({
                id: r.id,
                fromCity: r.fromCity,
                toCity: r.toCity,
                transportType: r.transportType,
                operatorName: r.operatorName,
                departureTime: r.departureTime,
                arrivalTime: r.arrivalTime,
                durationMinutes: r.durationMinutes,
                durationFormatted: `${Math.floor(r.durationMinutes / 60)}h ${r.durationMinutes % 60}m`,
                price: r.price,
                currency: r.currency,
                classType: r.classType,
                frequency: r.frequency,
            })),
            count: routes.length,
        });
    } catch (error) {
        console.error("Error searching transport:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to search transport" } },
            { status: 500 }
        );
    }
}
