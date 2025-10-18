import { db } from './index.js';
import { foodMenu, cleaningSlots, exchangeItems } from './schema.js';
import { sql as sqlOperator } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Seed the database with initial data from data.json
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Read data.json from project root
    const dataPath = path.join(__dirname, '../../../data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Seed food menu
    console.log('📝 Seeding food menu...');
    for (const food of data.indexes.food_menu) {
      await db.insert(foodMenu).values({
        id: food.id,
        house: food.house,
        block: food.block,
        dish: food.dish,
        tags: food.tags || [],
        diet: food.diet || [],
        allergens: food.allergens || [],
        price: food.price,
        eta: food.eta,
        available: true,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${data.indexes.food_menu.length} food items`);

    // Seed cleaning slots
    console.log('📝 Seeding cleaning slots...');
    for (const slot of data.indexes.cleaning_slots) {
      await db.insert(cleaningSlots).values({
        id: slot.id,
        time: slot.time,
        availableCleaner: slot.available_cleaner,
        petFriendly: slot.pet_friendly,
        price: slot.price,
        available: true,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${data.indexes.cleaning_slots.length} cleaning slots`);

    // Seed exchange items
    console.log('📝 Seeding exchange items...');
    for (const item of data.indexes.exchange_items) {
      await db.insert(exchangeItems).values({
        id: item.id,
        ownerBlock: item.owner_block,
        item: item.item,
        status: item.status,
        condition: item.condition,
        price: item.price || null,
        available: true,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${data.indexes.exchange_items.length} exchange items`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedDatabase();

