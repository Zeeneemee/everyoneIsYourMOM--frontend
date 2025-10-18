import convexClient from '../lib/convex';

const SEED_FLAG = 'convex_data_seeded';

/**
 * Check if data has already been seeded
 */
export function isDataSeeded() {
  return localStorage.getItem(SEED_FLAG) === 'true';
}

/**
 * Mark data as seeded
 */
function markDataAsSeeded() {
  localStorage.setItem(SEED_FLAG, 'true');
}

/**
 * Generate unique ID for items
 */
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Seed food items from data.json into Convex
 */
async function seedFoodItems(foodMenuData) {
  const results = [];
  
  for (const food of foodMenuData) {
    try {
      const id = await convexClient.mutation('foods:create', {
        itemId: food.id || generateId('food'),
        house: food.house,
        block: food.block,
        dish: food.dish,
        tags: food.tags || [],
        diet: Array.isArray(food.diet) ? food.diet : (food.diet ? [food.diet] : []),
        allergens: food.allergens || [],
        price: food.price,
        eta: food.eta,
        image: food.image || '',
        rating: 5.0,
        available: true,
      });
      results.push({ success: true, id, item: food.dish });
    } catch (error) {
      console.error(`Error seeding food ${food.dish}:`, error);
      results.push({ success: false, item: food.dish, error: error.message });
    }
  }
  
  return results;
}

/**
 * Seed cleaning slots from data.json into Convex
 */
async function seedCleaningSlots(cleaningSlotsData) {
  const results = [];
  
  for (const slot of cleaningSlotsData) {
    try {
      const id = await convexClient.mutation('cleaning:createSlot', {
        slotId: slot.id || generateId('clean'),
        time: slot.time,
        availableCleaner: slot.available_cleaner,
        petFriendly: slot.pet_friendly || false,
        price: slot.price,
        image: slot.image || '',
        duration: 2,
        available: true,
      });
      results.push({ success: true, id, item: slot.available_cleaner });
    } catch (error) {
      console.error(`Error seeding cleaning slot ${slot.available_cleaner}:`, error);
      results.push({ success: false, item: slot.available_cleaner, error: error.message });
    }
  }
  
  return results;
}

/**
 * Seed exchange items from data.json into Convex
 */
async function seedExchangeItems(exchangeItemsData) {
  const results = [];
  
  for (const item of exchangeItemsData) {
    try {
      const id = await convexClient.mutation('exchange:create', {
        itemId: item.id || generateId('item'),
        ownerBlock: item.owner_block,
        item: item.item,
        status: item.status,
        condition: item.condition,
        price: item.price || null,
        image: item.image || '',
        images: [],
        available: true,
      });
      results.push({ success: true, id, item: item.item });
    } catch (error) {
      console.error(`Error seeding exchange item ${item.item}:`, error);
      results.push({ success: false, item: item.item, error: error.message });
    }
  }
  
  return results;
}

/**
 * Main seeding function
 * Loads data.json and seeds all data into Convex
 */
export async function seedConvexData() {
  // Check if already seeded
  if (isDataSeeded()) {
    console.log('Data already seeded, skipping...');
    return {
      success: true,
      message: 'Data already seeded',
      alreadySeeded: true,
    };
  }

  try {
    console.log('Starting data seeding...');

    // Fetch data.json
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data.json');
    }

    const data = await response.json();

    // Seed each category
    console.log('Seeding food items...');
    const foodResults = await seedFoodItems(data.indexes.food_menu || []);

    console.log('Seeding cleaning slots...');
    const cleaningResults = await seedCleaningSlots(data.indexes.cleaning_slots || []);

    console.log('Seeding exchange items...');
    const exchangeResults = await seedExchangeItems(data.indexes.exchange_items || []);

    // Mark as seeded
    markDataAsSeeded();

    const results = {
      success: true,
      message: 'Data seeding completed',
      food: {
        total: foodResults.length,
        success: foodResults.filter(r => r.success).length,
        failed: foodResults.filter(r => !r.success).length,
      },
      cleaning: {
        total: cleaningResults.length,
        success: cleaningResults.filter(r => r.success).length,
        failed: cleaningResults.filter(r => !r.success).length,
      },
      exchange: {
        total: exchangeResults.length,
        success: exchangeResults.filter(r => r.success).length,
        failed: exchangeResults.filter(r => !r.success).length,
      },
    };

    console.log('Data seeding results:', results);
    return results;
  } catch (error) {
    console.error('Error during data seeding:', error);
    return {
      success: false,
      message: 'Data seeding failed',
      error: error.message,
    };
  }
}

/**
 * Reset seeding flag (for testing purposes)
 */
export function resetSeedingFlag() {
  localStorage.removeItem(SEED_FLAG);
  console.log('Seeding flag reset');
}

