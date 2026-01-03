import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/hotels - Search hotels by city
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cityId = searchParams.get("cityId");
        const category = searchParams.get("category"); // budget, mid, luxury
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");

        const where: any = { deletedAt: null };

        if (cityId) {
            where.cityId = cityId;
        }
        if (category) {
            where.category = category;
        }
        where.pricePerNight = { gte: minPrice, lte: maxPrice };

        const hotels = await prisma.hotel.findMany({
            where,
            include: {
                city: { select: { id: true, name: true, country: true } },
            },
            orderBy: { pricePerNight: "asc" },
        });

        return NextResponse.json({
            data: hotels.map(h => ({
                id: h.id,
                name: h.name,
                category: h.category,
                pricePerNight: h.pricePerNight,
                currency: h.currency,
                rating: h.rating,
                amenities: h.amenities ? JSON.parse(h.amenities) : [],
                description: h.description,
                address: h.address,
                imageUrl: h.imageUrl,
                city: h.city,
            })),
            count: hotels.length,
        });
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Failed to fetch hotels" } },
            { status: 500 }
        );
    }
}
