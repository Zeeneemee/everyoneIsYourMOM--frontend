import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
/**
 * Cleaning Slots and Bookings Queries and Mutations
 */
// Get all cleaning slots
export const getAllSlots = query({
    args: {
        available: v.optional(v.boolean()),
        petFriendly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("cleaningSlots");
        if (args.available !== undefined) {
            q = q.withIndex("by_available", (q) => q.eq("available", args.available));
        }
        const slots = await q.collect();
        // Filter by pet-friendly if specified
        if (args.petFriendly !== undefined) {
            return slots.filter((slot) => slot.petFriendly === args.petFriendly);
        }
        return slots;
    },
});
// Get paginated cleaning slots (12 per page)
export const getPaginated = query({
    args: {
        page: v.number(),
        pageSize: v.optional(v.number()),
        available: v.optional(v.boolean()),
        petFriendly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const pageSize = args.pageSize || 12;
        const offset = (args.page - 1) * pageSize;
        let q = ctx.db.query("cleaningSlots");
        if (args.available !== undefined) {
            q = q.withIndex("by_available", (q) => q.eq("available", args.available));
        }
        let allItems = await q.collect();
        // Filter by pet-friendly if specified
        if (args.petFriendly !== undefined) {
            allItems = allItems.filter((slot) => slot.petFriendly === args.petFriendly);
        }
        const total = allItems.length;
        const items = allItems.slice(offset, offset + pageSize);
        const totalPages = Math.ceil(total / pageSize);
        return {
            items,
            page: args.page,
            pageSize,
            total,
            totalPages,
            hasMore: args.page < totalPages,
        };
    },
});
// Get slot by ID
export const getSlotById = query({
    args: { id: v.id("cleaningSlots") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
// Search slots by preferences
export const searchSlots = query({
    args: {
        petFriendly: v.optional(v.boolean()),
        timeWindow: v.optional(v.string()),
        maxPrice: v.optional(v.number()),
        cleaner: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let slots = await ctx.db.query("cleaningSlots").collect();
        // Filter by pet-friendly
        if (args.petFriendly !== undefined) {
            slots = slots.filter((slot) => slot.petFriendly === args.petFriendly);
        }
        // Filter by time window
        if (args.timeWindow) {
            slots = slots.filter((slot) => slot.time.toLowerCase().includes(args.timeWindow.toLowerCase()));
        }
        // Filter by cleaner name
        if (args.cleaner) {
            slots = slots.filter((slot) => slot.availableCleaner.toLowerCase().includes(args.cleaner.toLowerCase()));
        }
        // Filter by max price
        if (args.maxPrice) {
            slots = slots.filter((slot) => {
                const price = parseFloat(slot.price.replace("$", "").replace("/hr", ""));
                return price <= args.maxPrice;
            });
        }
        return slots;
    },
});
// Book a cleaning slot
export const bookSlot = mutation({
    args: {
        slotId: v.id("cleaningSlots"),
        userId: v.id("users"),
        specialRequests: v.optional(v.string()),
        address: v.optional(v.string()),
        contactNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if slot is available
        const slot = await ctx.db.get(args.slotId);
        if (!slot || !slot.available) {
            throw new Error("Cleaning slot is not available");
        }
        // Create booking
        const bookingId = await ctx.db.insert("cleaningBookings", {
            slotId: args.slotId,
            userId: args.userId,
            status: "pending",
            specialRequests: args.specialRequests,
            address: args.address,
            contactNumber: args.contactNumber,
        });
        // Update slot availability
        await ctx.db.patch(args.slotId, { available: false });
        return await ctx.db.get(bookingId);
    },
});
// Get user's bookings
export const getUserBookings = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cleaningBookings")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    },
});
// Update booking status
export const updateBookingStatus = mutation({
    args: {
        bookingId: v.id("cleaningBookings"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.bookingId, { status: args.status });
        return await ctx.db.get(args.bookingId);
    },
});
// Create cleaning slot
export const createSlot = mutation({
    args: {
        slotId: v.string(),
        time: v.string(),
        date: v.optional(v.string()),
        availableCleaner: v.string(),
        petFriendly: v.boolean(),
        price: v.string(),
        duration: v.optional(v.number()),
        image: v.optional(v.string()),
        available: v.optional(v.boolean()),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if slot already exists
        const existing = await ctx.db
            .query("cleaningSlots")
            .withIndex("by_slot_id", (q) => q.eq("slotId", args.slotId))
            .first();
        if (existing) {
            console.log(`Cleaning slot ${args.slotId} already exists, skipping...`);
            return existing._id;
        }
        return await ctx.db.insert("cleaningSlots", {
            ...args,
            duration: args.duration || 2,
            available: args.available ?? true,
        });
    },
});
