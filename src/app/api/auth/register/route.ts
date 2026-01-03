import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(1, "Name is required").max(255),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = registerSchema.safeParse(body);

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

        const { email, password, fullName } = parsed.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: {
                        code: "USER_EXISTS",
                        message: "A user with this email already exists",
                    },
                },
                { status: 409 }
            );
        }

        // Get default user role
        let userRole = await prisma.role.findUnique({
            where: { name: "user" },
        });

        // Create role if it doesn't exist (for first-time setup)
        if (!userRole) {
            userRole = await prisma.role.create({
                data: {
                    name: "user",
                    description: "Standard user",
                    permissions: JSON.stringify(["trips:create", "trips:read:own", "trips:update:own", "trips:delete:own"]),
                },
            });
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                emailVerified: true, // For simplicity, auto-verify
                userRoles: {
                    create: {
                        roleId: userRole.id,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
                message: "Registration successful. Please log in.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                error: {
                    code: "INTERNAL_ERROR",
                    message: "An error occurred during registration",
                },
            },
            { status: 500 }
        );
    }
}
