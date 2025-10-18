import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
/**
 * Users and User Preferences Queries and Mutations
 */
// Get user by ID
export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
// Get user by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});
// Create user
export const create = mutation({
    args: {
        email: v.string(),
        fullName: v.optional(v.string()),
        block: v.optional(v.string()),
        unit: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("users", {
            ...args,
            momPoints: 0,
        });
    },
});
// Update user
export const update = mutation({
    args: {
        id: v.id("users"),
        data: v.object({
            fullName: v.optional(v.string()),
            block: v.optional(v.string()),
            unit: v.optional(v.string()),
            phoneNumber: v.optional(v.string()),
            onboardingCompleted: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.data);
        return await ctx.db.get(args.id);
    },
});
// Mark onboarding as completed
export const completeOnboarding = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { onboardingCompleted: true });
        return await ctx.db.get(args.userId);
    },
});
// Get user preferences
export const getPreferences = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
    },
});
// Update user preferences
export const updatePreferences = mutation({
    args: {
        userId: v.id("users"),
        dietaryRestrictions: v.optional(v.array(v.string())),
        allergens: v.optional(v.array(v.string())),
        preferredTags: v.optional(v.array(v.string())),
        petFriendly: v.optional(v.boolean()),
        preferredTimeSlots: v.optional(v.array(v.string())),
        maxDistance: v.optional(v.number()),
        language: v.optional(v.string()),
        voiceEnabled: v.optional(v.boolean()),
        notificationsEnabled: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Check if preferences exist
        const existing = await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        if (existing) {
            // Update existing
            const { userId, ...updates } = args;
            await ctx.db.patch(existing._id, updates);
            return await ctx.db.get(existing._id);
        }
        else {
            // Create new
            const id = await ctx.db.insert("userPreferences", {
                userId: args.userId,
                dietaryRestrictions: args.dietaryRestrictions || [],
                allergens: args.allergens || [],
                preferredTags: args.preferredTags || [],
                petFriendly: args.petFriendly ?? false,
                preferredTimeSlots: args.preferredTimeSlots || [],
                maxDistance: args.maxDistance || 1.0,
                language: args.language || "en",
                voiceEnabled: args.voiceEnabled ?? true,
                notificationsEnabled: args.notificationsEnabled ?? true,
            });
            return await ctx.db.get(id);
        }
    },
});
// Log user interaction
export const logInteraction = mutation({
    args: {
        userId: v.id("users"),
        interactionType: v.string(),
        intent: v.optional(v.string()),
        userMessage: v.optional(v.string()),
        aiResponse: v.optional(v.string()),
        emotion: v.optional(v.string()),
        metadata: v.optional(v.any()),
        successful: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("userInteractions", {
            ...args,
            successful: args.successful ?? true,
        });
    },
});
// Get interaction history
export const getInteractionHistory = query({
    args: {
        userId: v.id("users"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const interactions = await ctx.db
            .query("userInteractions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
        const sorted = interactions.sort((a, b) => b._creationTime - a._creationTime);
        return args.limit ? sorted.slice(0, args.limit) : sorted;
    },
});
// Update Mom Points
export const updateMomPoints = mutation({
    args: {
        userId: v.id("users"),
        points: v.number(),
        reason: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        // Get current user
        const user = await ctx.db.get(args.userId);
        if (!user)
            throw new Error("User not found");
        const newPoints = user.momPoints + args.points;
        // Update user points
        await ctx.db.patch(args.userId, { momPoints: newPoints });
        // Log points transaction
        await ctx.db.insert("momPointsHistory", {
            userId: args.userId,
            points: args.points,
            reason: args.reason,
            metadata: args.metadata,
        });
        return { newPoints, change: args.points };
    },
});
// Get Mom Points history
export const getMomPointsHistory = query({
    args: {
        userId: v.id("users"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const history = await ctx.db
            .query("momPointsHistory")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
        const sorted = history.sort((a, b) => b._creationTime - a._creationTime);
        return args.limit ? sorted.slice(0, args.limit) : sorted;
    },
});
