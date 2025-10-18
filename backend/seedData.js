/**
 * Script to seed cleaning and exchange data from public/data.json into Convex
 * 
 * Usage: node seedData.js
 */

const fs = require('fs');
const path = require('path');

async function seedData() {
  console.log('🌱 Starting data seeding process...\n');

  try {
    // Read data.json from public folder
    const dataPath = path.join(__dirname, '..', 'public', 'data.json');
    console.log(`📂 Reading data from: ${dataPath}`);
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`data.json not found at ${dataPath}`);
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Extract cleaning and exchange data
    const cleaningSlots = data.indexes?.cleaning_slots || [];
    const exchangeItems = data.indexes?.exchange_items || [];

    console.log(`\n📊 Data Summary:`);
    console.log(`   🧹 Cleaning Slots: ${cleaningSlots.length} items`);
    console.log(`   📦 Exchange Items: ${exchangeItems.length} items`);
    console.log('\n');

    // Display the data for manual entry
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SEEDING INSTRUCTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nOption 1: Use the Browser Console');
    console.log('─────────────────────────────────');
    console.log('1. Open your app in the browser');
    console.log('2. Open Developer Console (F12)');
    console.log('3. Run: forceSeed()');
    console.log('4. This will seed ALL data including food, cleaning, and exchange items\n');

    console.log('\nOption 2: Use Convex Dashboard (Recommended for manual control)');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('1. Open Convex Dashboard: https://dashboard.convex.dev');
    console.log('2. Navigate to your project');
    console.log('3. Go to "Functions" tab');
    console.log('4. Find and run: cleaning:createSlot (for each cleaning slot below)');
    console.log('5. Find and run: exchange:create (for each exchange item below)');
    console.log('\n');

    // Output cleaning slots
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧹 CLEANING SLOTS TO SEED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    cleaningSlots.forEach((slot, index) => {
      console.log(`[${index + 1}/${cleaningSlots.length}] ${slot.id}`);
      console.log('─'.repeat(60));
      console.log(JSON.stringify({
        slotId: slot.id,
        slot: slot.slot,
        time: slot.time,
        availableCleaner: slot.availableCleaner || slot.available_cleaner,
        petFriendly: slot.petFriendly !== undefined ? slot.petFriendly : slot.pet_friendly,
        price: slot.price,
        image: slot.image || '',
        duration: 2,
        available: true,
      }, null, 2));
      console.log('\n');
    });

    // Output exchange items
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 EXCHANGE ITEMS TO SEED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    exchangeItems.forEach((item, index) => {
      console.log(`[${index + 1}/${exchangeItems.length}] ${item.id}`);
      console.log('─'.repeat(60));
      console.log(JSON.stringify({
        itemId: item.id,
        ownerBlock: item.owner_block,
        item: item.item,
        status: item.status,
        condition: item.condition,
        price: item.price || null,
        image: '',
        images: [],
        available: true,
      }, null, 2));
      console.log('\n');
    });

    // Create a simplified JSON for easy copy-paste
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SIMPLIFIED DATA FOR COPY-PASTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const simplifiedData = {
      cleaningSlots: cleaningSlots.map(slot => ({
        slotId: slot.id,
        slot: slot.slot,
        time: slot.time,
        availableCleaner: slot.availableCleaner || slot.available_cleaner,
        petFriendly: slot.petFriendly !== undefined ? slot.petFriendly : slot.pet_friendly,
        price: slot.price,
        image: slot.image || '',
        duration: 2,
        available: true,
      })),
      exchangeItems: exchangeItems.map(item => ({
        itemId: item.id,
        ownerBlock: item.owner_block,
        item: item.item,
        status: item.status,
        condition: item.condition,
        price: item.price || null,
        image: '',
        images: [],
        available: true,
      })),
    };

    // Save to a file for easy reference
    const outputPath = path.join(__dirname, 'seed-data-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(simplifiedData, null, 2));
    console.log(`✅ Simplified data saved to: ${outputPath}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ QUICK START - Copy and paste this into your browser console:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('forceSeed()');
    console.log('\n✅ This will automatically seed all data from data.json!\n');

  } catch (error) {
    console.error('❌ Error during seeding process:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedData();

