# Quick Start: Testing Onboarding Feature

## What Was Built

A beautiful 4-step onboarding form that collects user preferences after registration:
1. **Step 1**: Dietary preferences & allergens
2. **Step 2**: Favorite cuisines  
3. **Step 3**: Health goals & cleaning frequency
4. **Step 4**: Exchange interests & additional notes

All data is saved to Convex `userPreferences` table, and completion status is tracked.

**Smart Flow:**
- ✅ **New users** (register) → See onboarding form
- ✅ **Existing users** (login) → Skip directly to home
- ✅ **Completed onboarding** → Won't see it again

## Quick Test (5 minutes)

### 1. Start the Backend
```bash
cd backend
npm install  # if not already done
npx convex dev  # Start Convex in dev mode
```

Keep this terminal running.

### 2. Start the Frontend (New Terminal)
```bash
# From project root
npm install  # if not already done
npm run dev
```

### 3. Test the Flow

**Test Registration (New User):**
1. Open browser to `http://localhost:5173`
2. Navigate to **Register**
3. Create a new account with any email/password
4. After registration, you'll automatically be redirected to **Onboarding**
5. Go through the 4 steps:
   - Select some dietary preferences
   - Choose favorite cuisines
   - Pick health goals and cleaning frequency
   - Select exchange interests
   - Optionally add notes
6. Click **Complete Setup**
7. You'll be redirected to Home
8. Your `onboardingCompleted` flag is set to `true`

**Test Login (Existing User):**
1. Navigate to **Login**
2. Login with your credentials
3. You'll be redirected directly to **Home** (skips onboarding!)
4. Even if you try to visit `/onboarding`, you'll be redirected to home

### 4. Verify Data Saved
Open Convex Dashboard:
- Go to https://dashboard.convex.dev/
- Select your project
- Click **Data** tab
- Check `userPreferences` table
- You should see your saved preferences!

## Features

✅ **Beautiful UI**: Dark theme with orange accents  
✅ **Progress Bar**: Visual feedback on completion  
✅ **Smooth Animations**: Framer Motion transitions  
✅ **Multi-select**: Choose multiple options per category  
✅ **Skip Option**: Can skip and complete later  
✅ **Back Navigation**: Can go back to previous steps  
✅ **Convex Integration**: Data persisted to database  
✅ **Mobile Responsive**: Works on all screen sizes  

## File Changes Summary

### New Files
- `src/components/OnboardingScreen.jsx` - The main onboarding component
- `ONBOARDING_FEATURE.md` - Detailed documentation
- `ONBOARDING_QUICK_START.md` - This file

### Modified Files
- `src/App.jsx` - Added `/onboarding` route
- `src/components/RegisterScreen.jsx` - Redirects to onboarding after registration

### No Backend Changes Needed
The existing Convex schema and mutations already support all the features!

## Customization

### Change Colors
Edit `OnboardingScreen.jsx`:
```javascript
// Find these classes and change colors:
className="border-[#FF6B35]"  // Selection border
className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D]"  // Button gradient
```

### Add/Remove Options
Edit the option arrays in `OnboardingScreen.jsx`:
```javascript
const cuisineOptions = [
  { id: 'italian', emoji: '🍝', label: 'Italian' },
  // Add more here...
];
```

### Change Number of Steps
1. Update `totalSteps` constant
2. Add new step in the `AnimatePresence` section
3. Update form state in `preferences` object

## Troubleshooting

### "No user ID found" Error
- Make sure you're logged in
- The user object should have an `id` field
- Check browser console for more details

### Preferences Not Saving
- Verify Convex is running (`npx convex dev`)
- Check `VITE_CONVEX_URL` in `.env` file
- Look at Convex logs for errors
- Verify `userPreferences` table exists in schema

### Redirect Issues
- Clear browser cache
- Check React Router setup in `App.jsx`
- Verify routes are correctly configured

### Style Issues
- Make sure Tailwind CSS is installed
- Run `npm install` if dependencies are missing
- Check for CSS conflicts

## Next Steps

### Integration with Features
The preferences can be used to:
1. **Food Screen**: Filter by dietary restrictions and favorite cuisines
2. **Cleaning Screen**: Pre-select preferred time slots
3. **Exchange Screen**: Show relevant items based on interests
4. **AI Mom**: Personalize recommendations and conversations

### Add to Profile Settings
Create a "Edit Preferences" section in Profile/Settings where users can:
- Update their preferences anytime
- See current selections
- Skip completed items

### Analytics
Track which preferences are most popular:
- Most common dietary restrictions
- Popular cuisine combinations
- Common health goals
- Popular exchange categories

Enjoy the new onboarding feature! 🎉

