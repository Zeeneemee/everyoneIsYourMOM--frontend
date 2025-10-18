# 🍽️ Upload Food Items with Images to Convex

This guide shows you how to upload all food items from `data.json` to Convex, including their images.

## ✅ What Was Done

### 1. Added Bulk Upload Mutation
Created `seedFoodMenu` mutation in `backend/convex/foods.ts` that:
- Accepts an array of food items
- Checks if items already exist (prevents duplicates)
- Properly maps all fields including **image URLs**
- Returns detailed results (success, skipped, failed)

### 2. Updated Frontend Components
Both `FoodScreen.jsx` and `CleaningScreen.jsx` now:
- Display actual images using `<img>` tags
- Remove any quotation marks from image URLs
- Fall back to emojis if images fail to load
- Use `object-cover` for proper image sizing

## 📤 How to Upload Food Data

### Option 1: Using the Upload Script (Recommended)

```bash
cd backend
node upload-food-items.js
```

This will:
- Read all 20 food items from `public/data.json`
- Upload them to Convex with images
- Show you a detailed report

### Option 2: Using Convex Dashboard

1. Go to your Convex Dashboard: https://dashboard.convex.dev
2. Select your project
3. Go to "Functions" → "foods:seedFoodMenu"
4. Paste this JSON:

```json
{
  "foods": [
    {
      "id": "food_001",
      "house": "Auntie Mei (Blk A-101)",
      "block": "A-101",
      "dish": "Hainanese Chicken Rice",
      "tags": ["high protein", "no dairy", "comfort"],
      "diet": ["halal-friendly"],
      "allergens": ["soy"],
      "price": "$6.50",
      "eta": "20 min",
      "image": "https://static01.nyt.com/images/2025/01/28/multimedia/KP-Hainan-Chicken-Rice-hcgv/KP-Hainan-Chicken-Rice-hcgv-mediumSquareAt3X.jpg"
    },
    ... (copy all 20 items from public/data.json)
  ]
}
```

5. Click "Run"

## 🖼️ Food Items with Images

All 20 food items from `data.json` include image URLs:

1. **Hainanese Chicken Rice** - Auntie Mei
2. **Laksa with fishcake** - Uncle Lim
3. **Homemade Curry Chicken** - Mrs Tan
4. **Tofu Basil Stir-Fry** - Chef Jia
5. **Nasi Lemak with fried egg** - Auntie Yati
6. **Prawn Mee Soup** - Mdm Liew
7. **Paneer Butter Masala** - Uncle Raj
8. **Char Kway Teow** - Auntie Bee
9. **Salmon Congee** - Chef Hana
10. **Steamed Herbal Chicken** - Auntie Ling
11. **Thai Basil Chicken Rice** - Uncle Sam
12. **Fishball Noodle Soup** - Auntie Ivy
13. **Beef Rendang with rice** - Chef Ben
14. **Mee Rebus** - Auntie Nur
15. **Vegetarian Bee Hoon** - Mdm Tan
16. **Roast Pork Rice** - Uncle Teo
17. **Tom Yum Fried Rice** - Auntie May
18. **Black Pepper Beef Udon** - Chef Lou
19. **Salted Egg Prawn Rice** - Uncle Heng
20. **Homemade Soto Ayam** - Auntie Rosa

## 🔍 Verify Upload

After uploading, check your food screen:
1. Run your app: `npm run dev`
2. Navigate to the Food Screen
3. You should see all food items with actual images

## 🐛 Troubleshooting

### Images Not Showing?
- Check browser console for image loading errors
- Verify image URLs are accessible
- The app will automatically fall back to emoji (🍽️) if images fail

### Duplicate Items?
- The mutation automatically skips existing items
- Check Convex dashboard → Data → foodMenu to see what's already there

### Need to Re-upload?
If you need to re-upload all data:
1. Go to Convex Dashboard
2. Data → foodMenu
3. Delete all items
4. Run the upload script again

## 📝 Data Structure

Each food item in Convex contains:
```typescript
{
  itemId: string,           // "food_001"
  house: string,            // "Auntie Mei (Blk A-101)"
  block: string,            // "A-101"
  dish: string,             // "Hainanese Chicken Rice"
  description: string,      // Auto-generated
  tags: string[],           // ["high protein", "no dairy", "comfort"]
  diet: string[],           // ["halal-friendly"]
  allergens: string[],      // ["soy"]
  price: string,            // "$6.50"
  eta: string,              // "20 min"
  distance: string,         // "0.5 km"
  rating: number,           // 5.0
  calories: string,         // "500 cal"
  protein: string,          // "20g protein"
  image: string,            // Full image URL
  available: boolean,       // true
}
```

## ✨ Benefits

✅ All 20 food items with beautiful images
✅ Automatic fallback to emojis if images fail
✅ No duplicate uploads (smart skip logic)
✅ Proper image display with object-cover
✅ Clean URLs without quotation marks

## 🚀 Next Steps

After uploading:
1. Test the Food Screen - images should load
2. Test filters - all items should be filterable
3. Test pagination - should work smoothly
4. Test voice assistant - should recommend with images

---

**Need help?** Check the console output from the upload script for detailed results!

