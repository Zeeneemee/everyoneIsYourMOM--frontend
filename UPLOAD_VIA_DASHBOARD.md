# 🍽️ Upload Food Items via Convex Dashboard

Since there are deployment conflicts, use the Convex Dashboard directly - it's faster and easier!

## 📋 Steps to Upload

### 1. Open Convex Dashboard
Go to: **https://dashboard.convex.dev**

### 2. Navigate to Your Project
Select: **giddy-cassowary-400** (or your project name)

### 3. Go to Functions
Click on **"Functions"** in the left sidebar

### 4. Find the Mutation
Search for: **`foods:seedFoodMenu`**

### 5. Copy the JSON Payload
Open the file: **`backend/food-upload-payload.json`**

Or copy from here:
```json
(The full JSON is in backend/food-upload-payload.json - it contains all 20 food items)
```

### 6. Paste and Run
1. Paste the entire JSON into the function arguments box
2. Click **"Run"**
3. Wait for the result

### 7. Check Results
You should see:
```json
{
  "success": 20,
  "failed": 0,
  "skipped": 0,
  "errors": []
}
```

## ✅ What Gets Uploaded

All 20 food items with:
- ✨ Full image URLs
- 🏠 House information
- 🏢 Block details
- 🍽️ Dish names
- 🏷️ Tags, diet, allergens
- 💰 Prices
- ⏱️ ETA times

## 🔍 Verify Upload

1. In Convex Dashboard, go to **"Data"** → **"foodMenu"**
2. You should see 20 items
3. Each should have an `image` field with a URL

## 🎨 See the Images

After uploading:
1. Run your app: `npm run dev`
2. Go to Food Screen
3. All dishes should display with beautiful images! 🖼️

## 🚀 Alternative: Quick Upload File

The JSON payload is already prepared in:
```
backend/food-upload-payload.json
```

Just copy the entire contents and paste into the Convex Dashboard!

---

**Pro tip**: If you see "already exists" messages, that's fine - it means those items were uploaded before!

