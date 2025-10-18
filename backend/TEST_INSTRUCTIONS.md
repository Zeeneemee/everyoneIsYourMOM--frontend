# 🧪 Food Image Analysis Test Instructions

## 📋 Prerequisites

✅ Gemini API Key is configured in `.env`
✅ Model is set to `gemini-2.0-flash`
✅ Test script is ready

## 🚀 How to Run the Test

### Step 1: Save the Test Image

**Option A: Save the chicken rice image from the chat**
1. Right-click on the food image (Hainanese Chicken Rice) in the chat
2. Save it as `test-food-image.jpg` 
3. Place it in this directory: `/Users/kristy-17/Documents/everyoneIsYourMOM--frontend/backend/`

**Option B: Use any food image**
1. Take a photo of any food or download a food image
2. Save it as `test-food-image.jpg`
3. Place it in the backend directory

### Step 2: Run the Test Script

Open your terminal and run:

```bash
cd /Users/kristy-17/Documents/everyoneIsYourMOM--frontend/backend
node test-food-simple.js
```

## 📊 Expected Output

You should see output like this:

```
════════════════════════════════════════════
  🧪 Food Image Analysis Test Suite
════════════════════════════════════════════

🍱 Testing Food Image Analysis with Gemini 2.0 Flash...

✅ Image found! Reading file...
📊 Image size: 245.67 KB

🔍 Analyzing food image with Gemini 2.0 Flash...
⏳ Please wait, this may take a few seconds...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FOOD ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍽️  Food Name:          Hainanese Chicken Rice
⚖️  Estimated Weight:   350 g
🔥 Calories:           520 kcal
💪 Protein:            30 g
🍚 Carbohydrates:      55 g
🧈 Fat:                18 g
🥗 Main Ingredients:   Chicken, rice, cucumber, chili sauce
💡 Health Tips:        Good protein source. Watch the sodium from sauces.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Analysis completed in 3.42 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Results saved to: food-analysis-results.json

🎉 Test completed successfully!
```

## 🔧 Troubleshooting

### Error: "Test image not found"
- Make sure you saved the image as `test-food-image.jpg` (not .png or .jpeg)
- Check the file is in the correct directory: `backend/test-food-image.jpg`

### Error: "GEMINI_API_KEY not set"
- Make sure your `.env` file exists with the API key
- Restart your terminal after adding the API key

### Error: "Failed to analyze food image"
- Check your internet connection
- Verify your Gemini API key is valid
- Make sure the image file is not corrupted

## 📝 Result File

The test will save results to `food-analysis-results.json` which contains:
```json
{
  "foodName": "Hainanese Chicken Rice",
  "estimatedWeight": "350",
  "calories": "520",
  "protein": "30",
  "carbohydrates": "55",
  "fat": "18",
  "mainIngredients": "Chicken, rice, cucumber, chili sauce",
  "healthTips": "Good protein source. Watch the sodium from sauces."
}
```

## 🎯 Next Steps

Once the test passes, you can integrate this into:
1. An API endpoint (e.g., `POST /api/food/analyze-image`)
2. Your food controller
3. The frontend UI for uploading food images

Happy testing! 🎉

