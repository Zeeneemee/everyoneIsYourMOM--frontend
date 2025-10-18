import { geminiService } from './src/utils/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test the food image analysis with a local image
 */
async function testFoodAnalysis() {
  console.log('🍱 Testing Food Image Analysis with Gemini 2.0 Flash...\n');
  
  try {
    // Path to the image you provided
    const testImagePath = path.join(__dirname, 'test-food-image.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found!');
      console.log('📝 Please save your chicken rice image as: test-food-image.jpg');
      console.log('📍 Location:', testImagePath);
      console.log('\nAlternatively, drag and drop the image into the backend folder and name it "test-food-image.jpg"');
      return;
    }
    
    console.log('✅ Image found! Reading file...');
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');
    console.log(`📊 Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);
    
    console.log('🔍 Analyzing food image with Gemini 2.0 Flash...');
    console.log('⏳ Please wait, this may take a few seconds...\n');
    
    const startTime = Date.now();
    
    // Determine mime type from file extension
    const mimeType = testImagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    // First, let's see the raw response from Gemini
    console.log('🔧 Debug: Getting raw response from Gemini...\n');
    
    const model = geminiService.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });
    
    const IMAGE_ANALYSIS_INSTRUCTION = `
Analyze the food in this image and provide information in this EXACT English format without any additional text or markdown:
Food Name: [Food Name]
Estimated Weight: [Estimated Weight in grams] g
Calories: [Number of Calories] kcal
Protein: [Amount of Protein] g
Carbohydrates: [Amount of Carbohydrates] g
Fat: [Amount of Fat] g
Main Ingredients: [Main Ingredients]
Health Tips: [Short relevant health tips]
`;
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };
    
    const rawResult = await model.generateContent([IMAGE_ANALYSIS_INSTRUCTION, imagePart]);
    const rawResponse = await rawResult.response;
    const rawText = rawResponse.text();
    
    console.log('📝 Raw Response from Gemini:');
    console.log('─────────────────────────────────────────');
    console.log(rawText);
    console.log('─────────────────────────────────────────\n');
    
    // Call the analyzeFoodImage function
    const result = await geminiService.analyzeFoodImage(base64Image, {
      mimeType: mimeType,
      temperature: 0.3,
      maxTokens: 500
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 FOOD ANALYSIS RESULTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🍽️  Food Name:         ', result.foodName || 'Unknown');
    console.log('⚖️  Estimated Weight:  ', result.estimatedWeight ? `${result.estimatedWeight} g` : 'N/A');
    console.log('🔥 Calories:          ', result.calories ? `${result.calories} kcal` : 'N/A');
    console.log('💪 Protein:           ', result.protein ? `${result.protein} g` : 'N/A');
    console.log('🍚 Carbohydrates:     ', result.carbohydrates ? `${result.carbohydrates} g` : 'N/A');
    console.log('🧈 Fat:               ', result.fat ? `${result.fat} g` : 'N/A');
    console.log('🥗 Main Ingredients:  ', result.mainIngredients || 'N/A');
    console.log('💡 Health Tips:       ', result.healthTips || 'N/A');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Analysis completed in ${duration} seconds`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Save results to JSON file
    const resultsPath = path.join(__dirname, 'food-analysis-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(result, null, 2));
    console.log(`💾 Results saved to: ${resultsPath}\n`);
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Error during food analysis:');
    console.error('   Message:', error.message);
    if (error.stack) {
      console.error('\n   Stack trace:', error.stack);
    }
    throw error;
  }
}

// Run the test
console.log('════════════════════════════════════════════');
console.log('  🧪 Food Image Analysis Test Suite');
console.log('════════════════════════════════════════════\n');

testFoodAnalysis()
  .then(() => {
    console.log('🎉 Test completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed!');
    process.exit(1);
  });

