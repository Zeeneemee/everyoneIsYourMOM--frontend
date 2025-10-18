import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Food Menu Queries and Mutations
 */

// Get all food items
export const getAll = query({
  args: {
    available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("foodMenu");
    
    if (args.available !== undefined) {
      q = q.withIndex("by_available", (q) => q.eq("available", args.available));
    }
    
    return await q.collect();
  },
});

// Get paginated food items (12 per page)
export const getPaginated = query({
  args: {
    page: v.number(),
    pageSize: v.optional(v.number()),
    available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize || 12;
    const offset = (args.page - 1) * pageSize;
    
    let q = ctx.db.query("foodMenu");
    
    if (args.available !== undefined) {
      q = q.withIndex("by_available", (q) => q.eq("available", args.available));
    }
    
    const allItems = await q.collect();
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

// Get food by ID
export const getById = query({
  args: { id: v.id("foodMenu") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get food by item ID (original ID from data.json)
export const getByItemId = query({
  args: { itemId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodMenu")
      .withIndex("by_item_id", (q) => q.eq("itemId", args.itemId))
      .first();
  },
});

// Search food by name
export const searchByName = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allFoods = await ctx.db.query("foodMenu").collect();
    return allFoods.filter((food) =>
      food.dish.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Search by dietary preferences
export const searchByDiet = query({
  args: {
    diet: v.optional(v.array(v.string())),
    excludeAllergens: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    maxPrice: v.optional(v.number()),
    maxEta: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let foods = await ctx.db
      .query("foodMenu")
      .withIndex("by_available", (q) => q.eq("available", true))
      .collect();

    // Filter by diet
    if (args.diet && args.diet.length > 0) {
      foods = foods.filter((food) =>
        args.diet!.some((d) => food.diet.includes(d))
      );
    }

    // Filter by tags
    if (args.tags && args.tags.length > 0) {
      foods = foods.filter((food) =>
        args.tags!.some((t) => food.tags.includes(t))
      );
    }

    // Exclude allergens
    if (args.excludeAllergens && args.excludeAllergens.length > 0) {
      foods = foods.filter(
        (food) =>
          !args.excludeAllergens!.some((a) => food.allergens.includes(a))
      );
    }

    // Filter by max price
    if (args.maxPrice) {
      foods = foods.filter((food) => {
        const price = parseFloat(food.price.replace("$", ""));
        return price <= args.maxPrice!;
      });
    }

    // Filter by max ETA
    if (args.maxEta && args.maxEta > 0) {
      foods = foods.filter((food) => {
        if (!food.eta) return true;
        const eta = parseInt(food.eta);
        return eta <= args.maxEta!;
      });
    }

    return foods;
  },
});

// Get nearby food
export const getNearbyFood = query({
  args: {
    block: v.string(),
    radius: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const foods = await ctx.db
      .query("foodMenu")
      .withIndex("by_available", (q) => q.eq("available", true))
      .collect();

    const radius = args.radius || 1.0;

    return foods
      .filter((food) => {
        if (!food.distance) return true;
        const distance = parseFloat(food.distance.replace(" km", ""));
        return distance <= radius;
      })
      .sort((a, b) => {
        const distA = parseFloat(a.distance?.replace(" km", "") || "999");
        const distB = parseFloat(b.distance?.replace(" km", "") || "999");
        return distA - distB;
      });
  },
});

// Create food item
export const create = mutation({
  args: {
    itemId: v.string(),
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
    rating: v.optional(v.number()),
    calories: v.optional(v.string()),
    protein: v.optional(v.string()),
    image: v.optional(v.string()),
    available: v.optional(v.boolean()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Check if item already exists
    const existing = await ctx.db
      .query("foodMenu")
      .withIndex("by_item_id", (q) => q.eq("itemId", args.itemId))
      .first();
    
    if (existing) {
      console.log(`Food item ${args.itemId} already exists, skipping...`);
      return existing._id;
    }
    
    return await ctx.db.insert("foodMenu", {
      ...args,
      rating: args.rating || 5.0,
      available: args.available ?? true,
    });
  },
});

// Update food item
export const update = mutation({
  args: {
    id: v.id("foodMenu"),
    data: v.object({
      house: v.optional(v.string()),
      block: v.optional(v.string()),
      dish: v.optional(v.string()),
      description: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      diet: v.optional(v.array(v.string())),
      allergens: v.optional(v.array(v.string())),
      price: v.optional(v.string()),
      eta: v.optional(v.string()),
      distance: v.optional(v.string()),
      rating: v.optional(v.number()),
      available: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
    return await ctx.db.get(args.id);
  },
});

// Delete food item
export const remove = mutation({
  args: { id: v.id("foodMenu") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

