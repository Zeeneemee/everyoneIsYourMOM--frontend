import { geminiService } from './src/utils/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Analyze the chicken rice image provided by user
 */
async function analyzeChickenRice() {
  console.log('🍱 Analyzing Hainanese Chicken Rice Image...\n');
  
  try {
    // This is a base64 representation of the chicken rice image
    // In a real app, you would receive this from a file upload
    const testImagePath = path.join(__dirname, 'chicken-rice.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Please save the chicken rice image as: chicken-rice.jpg');
      console.log('📍 Location:', __dirname);
      console.log('\n💡 Alternatively, you can save any food image as "chicken-rice.jpg" in the backend folder');
      return;
    }
    
    console.log('✅ Image found! Loading...');
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');
    console.log(`📊 Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);
    
    console.log('🔍 Analyzing with Gemini 2.0 Flash AI...\n');
    console.log('⏳ Please wait...\n');
    
    const startTime = Date.now();
    
    // Call the analyzeFoodImage function
    const result = await geminiService.analyzeFoodImage(base64Image, {
      mimeType: 'image/jpeg',
      temperature: 0.3,
      maxTokens: 500
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🍽️  FOOD ANALYSIS RESULTS - HAINANESE CHICKEN RICE');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📝 Food Name:          ', result.foodName || 'Unknown');
    console.log('⚖️  Estimated Weight:  ', result.estimatedWeight ? `${result.estimatedWeight} g` : 'N/A');
    console.log('\n💥 CALORIES:          ', result.calories ? `${result.calories} kcal` : 'N/A', '🔥');
    console.log('\n📊 MACRONUTRIENTS:');
    console.log('   💪 Protein:         ', result.protein ? `${result.protein} g` : 'N/A');
    console.log('   🍚 Carbohydrates:   ', result.carbohydrates ? `${result.carbohydrates} g` : 'N/A');
    console.log('   🧈 Fat:             ', result.fat ? `${result.fat} g` : 'N/A');
    console.log('\n🥗 Main Ingredients:');
    console.log('   ', result.mainIngredients || 'N/A');
    console.log('\n💡 Health Tips:');
    console.log('   ', result.healthTips || 'N/A');
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`✅ Analysis completed in ${duration} seconds`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Save detailed results
    const resultsPath = path.join(__dirname, 'chicken-rice-analysis.json');
    fs.writeFileSync(resultsPath, JSON.stringify(result, null, 2));
    console.log(`💾 Full results saved to: chicken-rice-analysis.json\n`);
    
    // Display calories prominently
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log(`║           🔥 TOTAL CALORIES: ${result.calories || '0'} kcal 🔥           ║`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Error during analysis:');
    console.error('   Message:', error.message);
    if (error.stack) {
      console.error('\n   Stack:', error.stack);
    }
    throw error;
  }
}

// Run the analysis
console.log('════════════════════════════════════════════');
console.log('  🧪 Food Calorie Analysis Test');
console.log('  📸 Image: Hainanese Chicken Rice');
console.log('════════════════════════════════════════════\n');

analyzeChickenRice()
  .then(() => {
    console.log('🎉 Analysis complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Analysis failed!');
    process.exit(1);
  });

