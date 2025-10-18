import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Exchange Items Queries and Mutations
 */

// Get all exchange items
export const getAll = query({
  args: {
    available: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("exchangeItems");

    if (args.available !== undefined) {
      q = q.withIndex("by_available", (q) => q.eq("available", args.available));
    } else if (args.status) {
      q = q.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    const items = await q.collect();
    return items.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get item by ID
export const getById = query({
  args: { id: v.id("exchangeItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search items
export const searchItems = query({
  args: {
    status: v.optional(v.string()),
    condition: v.optional(v.string()),
    itemType: v.optional(v.string()),
    ownerBlock: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("exchangeItems")
      .withIndex("by_available", (q) => q.eq("available", true))
      .collect();

    // Filter by status
    if (args.status) {
      items = items.filter((item) => item.status === args.status);
    }

    // Filter by condition
    if (args.condition) {
      items = items.filter((item) => item.condition === args.condition);
    }

    // Filter by item type (partial match)
    if (args.itemType) {
      items = items.filter((item) =>
        item.item.toLowerCase().includes(args.itemType!.toLowerCase())
      );
    }

    // Filter by owner block
    if (args.ownerBlock) {
      items = items.filter((item) =>
        item.ownerBlock.toLowerCase().includes(args.ownerBlock!.toLowerCase())
      );
    }

    return items.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get nearby items
export const getNearbyItems = query({
  args: {
    userBlock: v.string(),
    radius: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("exchangeItems")
      .withIndex("by_available", (q) => q.eq("available", true))
      .collect();

    const radius = args.radius || 3;

    return items.filter((item) => {
      const itemBlockLetter = item.ownerBlock?.match(/Blk ([A-Z])/)?.[1];
      const userBlockLetter =
        args.userBlock?.match(/Blk ([A-Z])/)?.[1] || args.userBlock?.[0];

      if (!itemBlockLetter || !userBlockLetter) return true;

      const distance = Math.abs(
        itemBlockLetter.charCodeAt(0) - userBlockLetter.charCodeAt(0)
      );
      return distance <= radius;
    });
  },
});

// Get user's items
export const getUserItems = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exchangeItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Create exchange item
export const create = mutation({
  args: {
    itemId: v.string(),
    ownerBlock: v.string(),
    item: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    condition: v.string(),
    price: v.optional(v.string()),
    category: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exchangeItems", {
      ...args,
      images: args.images || [],
      available: true,
      hasInterest: false,
    });
  },
});

// Update item
export const update = mutation({
  args: {
    id: v.id("exchangeItems"),
    data: v.object({
      item: v.optional(v.string()),
      description: v.optional(v.string()),
      status: v.optional(v.string()),
      condition: v.optional(v.string()),
      price: v.optional(v.string()),
      available: v.optional(v.boolean()),
      hasInterest: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
    return await ctx.db.get(args.id);
  },
});

// Delete item
export const remove = mutation({
  args: { id: v.id("exchangeItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Claim an item
export const claimItem = mutation({
  args: {
    itemId: v.id("exchangeItems"),
    claimedBy: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create claim
    const claimId = await ctx.db.insert("exchangeClaims", {
      itemId: args.itemId,
      claimedBy: args.claimedBy,
      status: "pending",
      message: args.message,
    });

    // Update item to indicate interest
    await ctx.db.patch(args.itemId, { hasInterest: true });

    return await ctx.db.get(claimId);
  },
});

// Get item claims
export const getItemClaims = query({
  args: { itemId: v.id("exchangeItems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exchangeClaims")
      .withIndex("by_item", (q) => q.eq("itemId", args.itemId))
      .collect();
  },
});

