/**
 * Manual Seed Script
 * Run this in browser console to force re-seeding
 */

import { seedConvexData, resetSeedingFlag } from './dataSeed';

/**
 * Force re-seed all data (food, cleaning, exchange)
 * This will bypass the localStorage flag
 */
export async function forceSeed() {
  console.log('🌱 Starting forced data seeding...');
  console.log('⚠️  This will attempt to seed even if already seeded');
  
  // Reset the flag
  resetSeedingFlag();
  
  // Run seeding
  const result = await seedConvexData();
  
  if (result.success) {
    console.log('✅ Seeding completed successfully!');
    console.log('📊 Results:', result);
    
    if (result.food) {
      console.log(`  🍽️  Food: ${result.food.success}/${result.food.total} items`);
    }
    if (result.cleaning) {
      console.log(`  🧹 Cleaning: ${result.cleaning.success}/${result.cleaning.total} slots`);
    }
    if (result.exchange) {
      console.log(`  📦 Exchange: ${result.exchange.success}/${result.exchange.total} items`);
    }
  } else {
    console.error('❌ Seeding failed:', result.error || result.message);
  }
  
  return result;
}

/**
 * Check current seeding status
 */
export function checkSeedStatus() {
  const isSeeded = localStorage.getItem('convex_data_seeded');
  console.log('📊 Seed Status:', isSeeded ? '✅ Already seeded' : '❌ Not seeded yet');
  return isSeeded === 'true';
}

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.forceSeed = forceSeed;
  window.checkSeedStatus = checkSeedStatus;
  console.log('🌱 Manual seed functions available:');
  console.log('  • forceSeed() - Force re-seed all data');
  console.log('  • checkSeedStatus() - Check if already seeded');
}

