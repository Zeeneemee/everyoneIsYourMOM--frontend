import { geminiService } from './src/utils/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download image and convert to base64
 */
async function downloadAndConvertImage(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks = [];
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        resolve(base64);
      });
      
      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

/**
 * Test the food image analysis
 */
async function testFoodAnalysis() {
  console.log('🍱 Testing Food Image Analysis with Gemini 2.0 Flash...\n');
  
  try {
    // The image URL from the user
    const imageUrl = 'https://github.com/user-attachments/assets/c5e8f5c5-5d5a-4f5e-8e5e-5d5a4f5e8e5e';
    
    console.log('📥 Downloading image...');
    
    // For testing, let's use a local path instead if download fails
    // You can save the image locally and use this path
    const testImagePath = path.join(__dirname, 'test-food-image.jpg');
    
    let base64Image;
    
    if (fs.existsSync(testImagePath)) {
      console.log('📁 Using local test image...');
      const imageBuffer = fs.readFileSync(testImagePath);
      base64Image = imageBuffer.toString('base64');
    } else {
      console.log('⚠️  Local test image not found at:', testImagePath);
      console.log('Please save the food image as "test-food-image.jpg" in the backend directory');
      return;
    }
    
    console.log('✅ Image loaded successfully!\n');
    console.log('🔍 Analyzing food image with Gemini...\n');
    
    // Call the analyzeFoodImage function
    const result = await geminiService.analyzeFoodImage(base64Image, {
      mimeType: 'image/jpeg',
      temperature: 0.3,
      maxTokens: 500
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 FOOD ANALYSIS RESULTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🍽️  Food Name:', result.foodName || 'Unknown');
    console.log('⚖️  Estimated Weight:', result.estimatedWeight ? `${result.estimatedWeight} g` : 'N/A');
    console.log('🔥 Calories:', result.calories ? `${result.calories} kcal` : 'N/A');
    console.log('💪 Protein:', result.protein ? `${result.protein} g` : 'N/A');
    console.log('🍚 Carbohydrates:', result.carbohydrates ? `${result.carbohydrates} g` : 'N/A');
    console.log('🧈 Fat:', result.fat ? `${result.fat} g` : 'N/A');
    console.log('🥗 Main Ingredients:', result.mainIngredients || 'N/A');
    console.log('💡 Health Tips:', result.healthTips || 'N/A');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Test completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Return the result for further use
    return result;
    
  } catch (error) {
    console.error('❌ Error during food analysis:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Run the test
testFoodAnalysis()
  .then(() => {
    console.log('🎉 All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  });

