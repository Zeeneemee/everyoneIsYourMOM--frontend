import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

/**
 * Seed the Convex database with initial data from data.json
 */
async function seedDatabase() {
  console.log('🌱 Starting Convex database seeding...');

  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error('❌ CONVEX_URL not found in environment variables');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    // Read data.json from project root
    const dataPath = path.join(__dirname, '../../../data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Seed food menu
    console.log('📝 Seeding food menu...');
    for (const food of data.indexes.food_menu) {
      await client.mutation(api.foods.create, {
        itemId: food.id,
        house: food.house,
        block: food.block,
        dish: food.dish,
        tags: food.tags || [],
        diet: food.diet || [],
        allergens: food.allergens || [],
        price: food.price,
        eta: food.eta,
        rating: 5.0,
        available: true,
      });
    }
    console.log(`✅ Seeded ${data.indexes.food_menu.length} food items`);

    // Seed cleaning slots
    console.log('📝 Seeding cleaning slots...');
    for (const slot of data.indexes.cleaning_slots) {
      await client.mutation(api.cleaning.createSlot, {
        slotId: slot.id,
        time: slot.time,
        availableCleaner: slot.available_cleaner,
        petFriendly: slot.pet_friendly,
        price: slot.price,
        duration: 2,
      });
    }
    console.log(`✅ Seeded ${data.indexes.cleaning_slots.length} cleaning slots`);

    // Seed exchange items
    console.log('📝 Seeding exchange items...');
    for (const item of data.indexes.exchange_items) {
      await client.mutation(api.exchange.create, {
        itemId: item.id,
        ownerBlock: item.owner_block,
        item: item.item,
        status: item.status,
        condition: item.condition,
        price: item.price || undefined,
        images: [],
      });
    }
    console.log(`✅ Seeded ${data.indexes.exchange_items.length} exchange items`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedDatabase();

