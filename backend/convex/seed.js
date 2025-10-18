import { mutation } from "./_generated/server";
import { v } from "convex/values";
/**
 * Seed all data from data.json
 * Call this mutation with the full data object
 */
export const seedAll = mutation({
    args: {
        cleaningSlots: v.array(v.object({
            id: v.string(),
            slot: v.optional(v.string()),
            time: v.string(),
            availableCleaner: v.string(),
            petFriendly: v.boolean(),
            price: v.string(),
            available: v.optional(v.boolean()),
            image: v.optional(v.string()),
        })),
        exchangeItems: v.array(v.object({
            id: v.string(),
            owner_block: v.string(),
            item: v.string(),
            status: v.string(),
            condition: v.string(),
            price: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const results = {
            cleaning: { success: 0, failed: 0, errors: [] },
            exchange: { success: 0, failed: 0, errors: [] },
        };
        // Seed cleaning slots
        for (const slot of args.cleaningSlots) {
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
                        available: slot.available !== undefined ? slot.available : true,
                    });
                    results.cleaning.success++;
                }
                else {
                    console.log(`Cleaning slot ${slot.id} already exists, skipping...`);
                }
            }
            catch (error) {
                results.cleaning.failed++;
                results.cleaning.errors.push(`${slot.id}: ${error.message}`);
                console.error(`Error seeding cleaning slot ${slot.id}:`, error);
            }
        }
        // Seed exchange items
        for (const item of args.exchangeItems) {
            try {
                // Check if already exists
                const existing = await ctx.db
                    .query("exchangeItems")
                    .withIndex("by_item_id", (q) => q.eq("itemId", item.id))
                    .first();
                if (!existing) {
                    await ctx.db.insert("exchangeItems", {
                        itemId: item.id,
                        ownerBlock: item.owner_block,
                        item: item.item,
                        status: item.status,
                        condition: item.condition,
                        price: item.price,
                        image: "",
                        images: [],
                        available: true,
                        hasInterest: false,
                    });
                    results.exchange.success++;
                }
                else {
                    console.log(`Exchange item ${item.id} already exists, skipping...`);
                }
            }
            catch (error) {
                results.exchange.failed++;
                results.exchange.errors.push(`${item.id}: ${error.message}`);
                console.error(`Error seeding exchange item ${item.id}:`, error);
            }
        }
        return results;
    },
});
