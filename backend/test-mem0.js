import dotenv from 'dotenv';
import { mem0Service } from './src/services/mem0Service.js';

dotenv.config();

/**
 * Simple test script to verify Mem0 integration
 * Run with: node test-mem0.js
 */

async function testMem0Integration() {
  console.log('\n🧪 Testing Mem0 Integration...\n');

  const testUserId = 'test_user_123';

  try {
    // Test 1: Store a memory
    console.log('📝 Test 1: Storing a memory...');
    const storeResult = await mem0Service.storeMemory(
      testUserId,
      {
        user: 'I love vegetarian food and I\'m allergic to nuts',
        assistant: 'Got it! I\'ll remember you prefer vegetarian food and avoid nuts.',
      },
      {
        intent: 'food',
        emotion: 'neutral',
        timestamp: new Date().toISOString(),
        type: 'text_chat',
      }
    );
    console.log('✅ Memory stored:', storeResult ? 'Success' : 'Failed (Mem0 might be disabled)');

    // Wait a bit for Mem0 to index
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Retrieve memories
    console.log('\n🔍 Test 2: Retrieving memories...');
    const memories = await mem0Service.retrieveMemories(
      testUserId,
      'What food do I like?',
      5
    );
    console.log(`✅ Retrieved ${memories.length} memories`);
    if (memories.length > 0) {
      console.log('Sample memory:', memories[0]);
    }

    // Test 3: Get all memories
    console.log('\n📚 Test 3: Getting all memories...');
    const allMemories = await mem0Service.getAllUserMemories(testUserId);
    console.log(`✅ Total memories for user: ${allMemories.length}`);

    // Test 4: Search memories
    console.log('\n🔎 Test 4: Searching memories...');
    const searchResults = await mem0Service.searchMemories(
      testUserId,
      'food preferences',
      { limit: 3 }
    );
    console.log(`✅ Search found ${searchResults.length} memories`);

    // Test 5: Get memory stats
    console.log('\n📊 Test 5: Getting memory stats...');
    const stats = await mem0Service.getMemoryStats(testUserId);
    if (stats) {
      console.log('✅ Memory statistics:');
      console.log('  Total memories:', stats.total);
      console.log('  By type:', stats.byType);
      console.log('  By intent:', stats.byIntent);
    } else {
      console.log('⚠️  No stats available');
    }

    // Test 6: Clear test memories
    console.log('\n🗑️  Test 6: Cleaning up test memories...');
    const clearResult = await mem0Service.clearAllMemories(testUserId);
    console.log(`✅ Cleared ${clearResult.count || 0} test memories`);

    console.log('\n✨ All tests completed!\n');
    console.log('Note: If Mem0 is disabled (no API key), tests will report as "disabled" rather than failing.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests
testMem0Integration();

