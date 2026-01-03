import { z } from "zod";

// Trip validation schemas
export const createTripSchema = z.object({
    name: z.string().min(1, "Trip name is required").max(255),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    coverPhotoUrl: z.string().url().optional().nullable(),
    totalEstimatedCost: z.number().optional(),
    currency: z.string().optional(),
    travelStyle: z.string().optional(),
});

export const updateTripSchema = createTripSchema.partial().extend({
    status: z.enum(["draft", "planned", "active", "completed", "cancelled"]).optional(),
    isPublic: z.boolean().optional(),
});

// Stop validation schemas
export const createStopSchema = z.object({
    cityId: z.string().uuid("Invalid city ID"),
    stopOrder: z.number().int().positive().optional(),
    arrivalDate: z.string().datetime("Invalid date format"),
    departureDate: z.string().datetime("Invalid date format"),
    accommodationName: z.string().max(255).optional().nullable(),
    accommodationCost: z.number().nonnegative().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export const updateStopSchema = createStopSchema.partial();

// Activity validation schemas
export const createStopActivitySchema = z.object({
    activityId: z.string().uuid("Invalid activity ID"),
    scheduledDate: z.string().datetime("Invalid date format"),
    scheduledTime: z.string().optional().nullable(),
    actualCost: z.number().nonnegative().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export const updateStopActivitySchema = createStopActivitySchema.partial().extend({
    isCompleted: z.boolean().optional(),
});

// Budget validation schemas
export const budgetCategorySchema = z.enum([
    "transport",
    "accommodation",
    "activities",
    "meals",
    "shopping",
    "other",
]);

export const updateBudgetSchema = z.object({
    estimatedAmount: z.number().nonnegative(),
    actualAmount: z.number().nonnegative().optional().nullable(),
    notes: z.string().optional().nullable(),
});

// Search validation schemas
export const citySearchSchema = z.object({
    q: z.string().optional(),
    countryCode: z.string().length(2).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const activitySearchSchema = z.object({
    q: z.string().optional(),
    cityId: z.string().uuid().optional(),
    category: z.string().optional(),
    minCost: z.coerce.number().nonnegative().optional(),
    maxCost: z.coerce.number().nonnegative().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

// Share validation schemas
export const createShareSchema = z.object({
    shareType: z.enum(["public", "private", "friends"]).default("public"),
    sharedWithEmail: z.string().email().optional().nullable(),
    expiresAt: z.string().datetime().optional().nullable(),
});

// Type exports
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type CreateStopActivityInput = z.infer<typeof createStopActivitySchema>;
export type UpdateStopActivityInput = z.infer<typeof updateStopActivitySchema>;
export type BudgetCategory = z.infer<typeof budgetCategorySchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CitySearchParams = z.infer<typeof citySearchSchema>;
export type ActivitySearchParams = z.infer<typeof activitySearchSchema>;
export type CreateShareInput = z.infer<typeof createShareSchema>;
