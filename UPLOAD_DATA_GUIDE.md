# 🌱 Data Upload Guide

## Quick Upload Instructions

### Option 1: Automatic (First Time)
When you start the app for the first time, data will automatically upload from `/public/data.json` to Convex.

```bash
npm run dev
```

Open the browser console (F12) and look for:
```
Starting data seeding...
Seeding food items...
Seeding cleaning slots...      ← 10 cleaning slots
Seeding exchange items...      ← 10 exchange items
Data seeding results: { ... }
```

---

### Option 2: Force Re-Upload (If Already Seeded)

If data was already seeded but you want to upload again:

**Step 1:** Open browser console (F12)

**Step 2:** Clear the seeding flag:
```javascript
localStorage.removeItem('convex_data_seeded')
```

**Step 3:** Reload the page:
```javascript
window.location.reload()
```

**Step 4:** Check the console for seeding results:
```
✅ Food: 20/20 items
✅ Cleaning: 10/10 slots
✅ Exchange: 10/10 items
```

---

### Option 3: Verify Data in Convex Dashboard

1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Click on "Data" tab
4. Check these tables:
   - `cleaningSlots` - should have 10 entries
   - `exchangeItems` - should have 10 entries  
   - `foodMenu` - should have 20 entries

---

## 📊 What Gets Uploaded

### Cleaning Slots (10 items)
```json
{
  "id": "clean_01",
  "time": "10:00 AM - 12:00 PM",
  "available_cleaner": "Auntie Siew",
  "pet_friendly": true,
  "price": "$20/hr",
  "image": "https://..."
}
```

**Uploaded Fields:**
- slotId
- time
- availableCleaner
- petFriendly
- price
- image
- duration (default: 2 hours)
- available (default: true)

### Exchange Items (10 items)
```json
{
  "id": "item_01",
  "owner_block": "Blk A-304",
  "item": "Rice Cooker 1.2L",
  "status": "donate",
  "condition": "good"
}
```

**Uploaded Fields:**
- itemId
- ownerBlock
- item
- status (donate/exchange/sell)
- condition
- price (if status is "sell")
- images (empty array by default)
- available (default: true)

---

## 🔍 Troubleshooting

### Issue: "Data already seeded, skipping..."
**Solution:** Clear localStorage and reload (see Option 2 above)

### Issue: "Failed to fetch data.json"
**Solution:** Make sure `/public/data.json` exists
```bash
ls -la public/data.json
```

### Issue: Duplicates in Convex
**Don't worry!** The upload functions now check for existing items and skip duplicates automatically.

### Issue: Some items failed to upload
**Check the console** for specific error messages:
```
Data seeding results: {
  cleaning: {
    total: 10,
    success: 10,
    failed: 0     ← Should be 0
  },
  exchange: {
    total: 10,
    success: 10,
    failed: 0     ← Should be 0
  }
}
```

---

## ✅ Verification Checklist

After upload, verify in your app:

- [ ] Open Food screen → Should show 20 items (2 pages of 6 items)
- [ ] Open Cleaning screen → Should show 10 slots (1 page)
- [ ] Open Exchange screen → Should show 10 items (1 page)
- [ ] Check browser console → No errors
- [ ] Check Convex dashboard → All tables populated

---

## 🎯 Expected Results

After successful upload, you should have:

| Table | Items | Status |
|-------|-------|--------|
| foodMenu | 20 | ✅ Ready |
| cleaningSlots | 10 | ✅ Ready |
| exchangeItems | 10 | ✅ Ready |

**Total: 40 items seeded!** 🎉

---

## 📝 Notes

1. **Exchange items don't have images** in data.json - they use emoji fallbacks in the UI
2. **Cleaning slots have images** - actual cleaner photos from the data
3. **Food items have images** - actual dish photos from the data
4. **Duplicate prevention** - Re-uploading won't create duplicates
5. **Automatic seeding** - Runs on first app load (using localStorage flag)

---

## 🚀 Quick Commands

```bash
# Start dev server
npm run dev

# Check if data.json exists
cat public/data.json | grep "cleaning_slots" -A 5

# Open Convex dashboard
open https://dashboard.convex.dev
```

---

Need help? Check the console logs for detailed information about the seeding process!

