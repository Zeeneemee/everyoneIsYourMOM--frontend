import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
/**
 * Convex Database Schema for "Everyone Is Your Mom"
 */
export default defineSchema({
    // Users table
    users: defineTable({
        email: v.string(),
        fullName: v.optional(v.string()),
        block: v.optional(v.string()),
        unit: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        momPoints: v.number(),
        onboardingCompleted: v.optional(v.boolean()),
    })
        .index("by_email", ["email"]),
    // User preferences
    userPreferences: defineTable({
        userId: v.id("users"),
        dietaryRestrictions: v.array(v.string()),
        allergens: v.array(v.string()),
        preferredTags: v.array(v.string()),
        petFriendly: v.boolean(),
        preferredTimeSlots: v.array(v.string()),
        maxDistance: v.number(),
        language: v.string(),
        voiceEnabled: v.boolean(),
        notificationsEnabled: v.boolean(),
    })
        .index("by_user", ["userId"]),
    // Food menu
    foodMenu: defineTable({
        itemId: v.string(), // Original ID from data.json
        house: v.string(),
        block: v.string(),
        dish: v.string(),
        description: v.optional(v.string()),
        tags: v.array(v.string()),
        diet: v.array(v.string()),
        allergens: v.array(v.string()),
        price: v.string(),
        eta: v.optional(v.string()),
        distance: v.optional(v.string()),
        rating: v.number(),
        calories: v.optional(v.string()),
        protein: v.optional(v.string()),
        image: v.optional(v.string()),
        available: v.boolean(),
        userId: v.optional(v.id("users")),
    })
        .index("by_item_id", ["itemId"])
        .index("by_block", ["block"])
        .index("by_available", ["available"])
        .index("by_user", ["userId"]),
    // Cleaning slots
    cleaningSlots: defineTable({
        slotId: v.string(), // Original ID from data.json
        slot: v.optional(v.string()), // Time slot category (morning, afternoon, evening, night)
        time: v.string(),
        date: v.optional(v.string()),
        availableCleaner: v.string(),
        petFriendly: v.boolean(),
        price: v.string(),
        duration: v.optional(v.number()),
        image: v.optional(v.string()),
        available: v.boolean(),
        description: v.optional(v.string()),
    })
        .index("by_slot_id", ["slotId"])
        .index("by_available", ["available"])
        .index("by_pet_friendly", ["petFriendly"]),
    // Cleaning bookings
    cleaningBookings: defineTable({
        slotId: v.id("cleaningSlots"),
        userId: v.id("users"),
        status: v.string(), // pending, confirmed, completed, cancelled
        specialRequests: v.optional(v.string()),
        address: v.optional(v.string()),
        contactNumber: v.optional(v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_slot", ["slotId"])
        .index("by_status", ["status"]),
    // Exchange items
    exchangeItems: defineTable({
        itemId: v.string(), // Original ID from data.json
        ownerBlock: v.string(),
        item: v.string(),
        description: v.optional(v.string()),
        status: v.string(), // donate, exchange, sell
        condition: v.string(), // like new, good, fair, poor
        price: v.optional(v.string()),
        category: v.optional(v.string()),
        image: v.optional(v.string()),
        images: v.array(v.string()),
        userId: v.optional(v.id("users")),
        available: v.boolean(),
        hasInterest: v.optional(v.boolean()),
    })
        .index("by_item_id", ["itemId"])
        .index("by_status", ["status"])
        .index("by_available", ["available"])
        .index("by_user", ["userId"]),
    // Exchange claims
    exchangeClaims: defineTable({
        itemId: v.id("exchangeItems"),
        claimedBy: v.id("users"),
        status: v.string(), // pending, accepted, rejected, completed
        message: v.optional(v.string()),
    })
        .index("by_item", ["itemId"])
        .index("by_claimer", ["claimedBy"])
        .index("by_status", ["status"]),
    // User interactions (for AI learning)
    userInteractions: defineTable({
        userId: v.id("users"),
        interactionType: v.string(), // voice, text, action
        intent: v.optional(v.string()), // food, cleaning, exchange, general
        userMessage: v.optional(v.string()),
        aiResponse: v.optional(v.string()),
        emotion: v.optional(v.string()),
        metadata: v.optional(v.any()),
        successful: v.boolean(),
    })
        .index("by_user", ["userId"])
        .index("by_intent", ["intent"]),
    // Mom points history
    momPointsHistory: defineTable({
        userId: v.id("users"),
        points: v.number(),
        reason: v.string(),
        metadata: v.optional(v.any()),
    })
        .index("by_user", ["userId"]),
    // Food orders
    foodOrders: defineTable({
        userId: v.id("users"),
        foodId: v.id("foodMenu"),
        quantity: v.number(),
        status: v.string(), // pending, confirmed, preparing, delivered, cancelled
        deliveryAddress: v.optional(v.string()),
        specialInstructions: v.optional(v.string()),
        totalPrice: v.optional(v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_food", ["foodId"])
        .index("by_status", ["status"]),
    // Conversations
    conversations: defineTable({
        userId: v.id("users"),
        title: v.optional(v.string()),
        messages: v.array(v.object({
            role: v.string(),
            content: v.string(),
            timestamp: v.string(),
        })),
    })
        .index("by_user", ["userId"]),
});
