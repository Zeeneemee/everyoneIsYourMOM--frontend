/**
 * Test script for the food card route
 * Run: node test-food-card.js
 */

const API_BASE = 'http://localhost:3000/api/food';

async function testFoodCard(query) {
  console.log(`\n🔍 Searching for: "${query}"`);
  console.log('─'.repeat(60));
  
  try {
    const url = `${API_BASE}/card?query=${encodeURIComponent(query)}`;
    console.log(`📡 GET ${url}\n`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Success! Found ${data.count} item(s)\n`);
      
      data.data.forEach((item, index) => {
        console.log(`📦 Item ${index + 1}:`);
        console.log(`   ID: ${item.id}`);
        console.log(`   Dish: ${item.dishName}`);
        console.log(`   House: ${item.house}`);
        console.log(`   Block: ${item.block}`);
        console.log(`   Price: ${item.price}`);
        console.log(`   Rating: ⭐ ${item.rating}`);
        console.log(`   Diet: ${item.diet.join(', ')}`);
        console.log(`   Tags: ${item.tags.join(', ')}`);
        console.log(`   ETA: ${item.eta}`);
        console.log(`   Distance: ${item.distance}`);
        console.log(`   Available: ${item.available ? '✓' : '✗'}`);
        console.log(`   Calories: ${item.calories}`);
        console.log(`   Protein: ${item.protein}`);
        if (item.allergens.length > 0) {
          console.log(`   ⚠️  Allergens: ${item.allergens.join(', ')}`);
        }
        console.log('');
      });
    } else {
      console.log(`❌ Error: ${data.error}\n`);
    }
  } catch (error) {
    console.log(`💥 Request failed: ${error.message}\n`);
  }
}

async function runTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Testing Food Card Route');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Test 1: Search for chicken
  await testFoodCard('chicken');
  
  // Test 2: Search for rice
  await testFoodCard('rice');
  
  // Test 3: Search for nasi lemak
  await testFoodCard('nasi lemak');
  
  // Test 4: Search for burger
  await testFoodCard('burger');
  
  // Test 5: Search for something that doesn't exist
  await testFoodCard('xyz123nonexistent');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Tests Complete');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    if (data.success) {
      console.log('✅ Server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return false;
  }
}

// Run the tests
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();

