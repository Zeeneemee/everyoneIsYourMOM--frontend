/**
 * Script to upload cleaning slots data to Convex
 * 
 * Usage: node upload-cleaning-slots.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadData() {
  console.log('🚀 Uploading cleaning slots to Convex...\n');

  try {
    // Read the data file
    const dataPath = path.join(__dirname, 'cleaning-slots-upload.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log('📊 Data Summary:');
    console.log(`   🧹 Cleaning Slots: ${data.cleaningSlots.length} items\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 UPLOAD INSTRUCTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Option 1: Use Convex Dashboard (Recommended)');
    console.log('─────────────────────────────────────────────');
    console.log('1. Open Convex Dashboard: https://dashboard.convex.dev');
    console.log('2. Navigate to your project');
    console.log('3. Go to "Functions" tab');
    console.log('4. Find: seed:seedAll');
    console.log('5. Copy and paste the JSON below as the argument:\n');

    console.log(JSON.stringify(data, null, 2));

    console.log('\n\nOption 2: Use Browser Console');
    console.log('──────────────────────────────');
    console.log('1. Open your app in the browser');
    console.log('2. Open Developer Console (F12)');
    console.log('3. Paste and run:\n');
    
    console.log(`
const data = ${JSON.stringify(data, null, 2)};

// Using Convex client
const { ConvexHttpClient } = await import("convex/browser");
const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);
const result = await client.mutation(api.seed.seedAll, data);
console.log("Upload result:", result);
    `.trim());

    console.log('\n\n✅ Data is ready to be uploaded!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadData();

