import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Direct upload mutation for cleaning slots
 * Call this from the Convex dashboard with the data
 */
export const uploadCleaningSlots = mutation({
  args: {
    slots: v.array(
      v.object({
        id: v.string(),
        slot: v.optional(v.string()),
        time: v.string(),
        availableCleaner: v.string(),
        petFriendly: v.boolean(),
        price: v.string(),
        available: v.boolean(),
        image: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const slot of args.slots) {
      try {
        // Check if already exists
        const existing = await ctx.db
          .query("cleaningSlots")
          .withIndex("by_slot_id", (q) => q.eq("slotId", slot.id))
          .first();

        if (!existing) {
          await ctx.db.insert("cleaningSlots", {
            slotId: slot.id,
            slot: slot.slot,
            time: slot.time,
            availableCleaner: slot.availableCleaner,
            petFriendly: slot.petFriendly,
            price: slot.price,
            image: slot.image,
            duration: 2,
            available: slot.available,
          });
          results.success++;
          console.log(`✅ Added: ${slot.id} - ${slot.availableCleaner}`);
        } else {
          results.skipped++;
          console.log(`⏭️ Skipped (exists): ${slot.id}`);
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${slot.id}: ${error.message}`);
        console.error(`❌ Error: ${slot.id}:`, error);
      }
    }

    return results;
  },
});

/**
 * Direct upload mutation for exchange items
 * Call this from the Convex dashboard with the data
 */
export const uploadExchangeItems = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.string(),
        ownerBlock: v.string(),
        item: v.string(),
        status: v.string(),
        condition: v.string(),
        price: v.optional(v.string()),
        image: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const item of args.items) {
      try {
        // Check if already exists
        const existing = await ctx.db
          .query("exchangeItems")
          .withIndex("by_item_id", (q) => q.eq("itemId", item.id))
          .first();

        if (!existing) {
          await ctx.db.insert("exchangeItems", {
            itemId: item.id,
            ownerBlock: item.ownerBlock,
            item: item.item,
            status: item.status,
            condition: item.condition,
            price: item.price,
            image: item.image || "",
            images: [],
            available: true,
            hasInterest: false,
          });
          results.success++;
          console.log(`✅ Added: ${item.id} - ${item.item}`);
        } else {
          results.skipped++;
          console.log(`⏭️ Skipped (exists): ${item.id}`);
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${item.id}: ${error.message}`);
        console.error(`❌ Error: ${item.id}:`, error);
      }
    }

    return results;
  },
});

