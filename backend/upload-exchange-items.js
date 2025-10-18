/**
 * Direct upload script for exchange items to Convex
 * Usage: node upload-exchange-items.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVEX_URL = "https://giddy-cassowary-400.convex.cloud";

async function uploadData() {
  console.log('🚀 Starting upload to Convex...\n');
  console.log(`📡 Convex URL: ${CONVEX_URL}\n`);

  try {
    // Read the data file
    const dataPath = path.join(__dirname, 'exchange-items-upload.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`📊 Uploading ${data.exchangeItems.length} exchange items...\n`);

    // Upload using direct HTTP POST to Convex
    const response = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: "uploadData:uploadExchangeItems",
        args: { items: data.exchangeItems },
        format: "json"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    console.log('📦 Raw response:', JSON.stringify(responseData, null, 2));

    // Extract the actual result from Convex response
    const result = responseData.value || responseData;

    console.log('\n✅ Upload Complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully added: ${result.success || 0}`);
    console.log(`⏭️  Skipped (existing): ${result.skipped || 0}`);
    console.log(`❌ Failed: ${result.failed || 0}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

    console.log('\n🎉 All done!\n');

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

uploadData();

