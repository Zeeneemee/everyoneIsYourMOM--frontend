# User Onboarding Feature

## Overview
A 4-step onboarding flow that collects user preferences when they first register. This helps personalize the user experience across food, cleaning, and exchange features.

## Implementation Details

### Components Created
- **`OnboardingScreen.jsx`**: Multi-step form component with beautiful UI matching the app's dark theme

### Routes Added
- `/onboarding` - The onboarding flow screen

### Integration Points
1. **Registration Flow**: After successful registration, users are redirected to `/onboarding` instead of home
2. **Convex Integration**: User preferences are saved to the `userPreferences` table in Convex
3. **Skip Option**: Users can skip onboarding and complete it later

## Onboarding Steps

### Step 1: Dietary Preferences
- **Dietary Restrictions**: Vegetarian, Vegan, Halal, Kosher, Gluten-Free, Dairy-Free
- **Allergens to Avoid**: Nuts, Shellfish, Eggs, Soy

### Step 2: Favorite Cuisines
Choose preferred cuisines:
- Italian 🍝
- Asian 🍜
- Mexican 🌮
- Indian 🍛
- American 🍔
- Mediterranean 🥙

### Step 3: Health & Home Goals
**Health Goals**:
- Weight Loss ⚖️
- Muscle Gain 💪
- More Energy ⚡
- General Health ❤️

**Cleaning Frequency**:
- Weekly
- Bi-weekly
- Monthly

### Step 4: Exchange Interests
Select items of interest:
- Books 📚
- Kitchen 🔍
- Home Decor 🏠
- Sports ⚽
- Tech ⌨️
- Clothes 👕

Plus a free-form text area for additional preferences.

## Data Storage

All preferences are saved to the Convex `userPreferences` table with the following mapping:

```javascript
{
  userId: user.id,
  dietaryRestrictions: ['vegetarian', 'gluten-free', ...],
  allergens: ['nuts', 'shellfish', ...],
  preferredTags: [...cuisines, ...healthGoals, ...exchangeInterests],
  preferredTimeSlots: [cleaningFrequency],
  petFriendly: false,
  maxDistance: 5.0,
  language: 'en',
  voiceEnabled: true,
  notificationsEnabled: true
}
```

## UI/UX Features

### Design Elements
- **Progress Bar**: Shows completion progress across all 4 steps
- **Step Indicator**: "Step X of 4" with progress percentage
- **Mom Avatar**: Friendly emoji avatar in the header
- **Smooth Transitions**: Animated page transitions using Framer Motion
- **Multi-select Buttons**: Visual feedback with orange border on selection
- **Skip Option**: Users can skip and complete later

### Navigation
- **Back Button**: Navigate to previous step
- **Continue Button**: Proceed to next step
- **Complete Setup**: Final step button
- **Skip for now**: Available on all steps

### Responsive Layout
- Mobile-first design
- Dark theme (#0F0F0F background)
- Orange accent colors (#FF6B35 to #FFB84D gradient)
- Smooth animations and transitions

## Testing the Feature

### Prerequisites
1. Ensure Convex is running: `npx convex dev` (in backend folder)
2. Ensure environment variables are set:
   - `VITE_CONVEX_URL` in frontend `.env`
   - `CONVEX_URL` in backend `.env`

### Test Flow
1. Navigate to `/register`
2. Fill in registration form
3. Submit registration
4. Should automatically redirect to `/onboarding`
5. Complete all 4 steps
6. Click "Complete Setup"
7. Should redirect to `/home`
8. User preferences should be saved in Convex

### Verification
Check Convex dashboard to verify:
1. User record exists in `users` table
2. Preferences record exists in `userPreferences` table
3. All selected preferences are properly saved

## Future Enhancements

### Potential Improvements
1. **Analytics**: Track completion rates for each step
2. **Progressive Disclosure**: Show relevant features based on selections
3. **Personalized Recommendations**: Use preferences for AI-powered suggestions
4. **Profile Integration**: Allow editing preferences from profile settings
5. **Onboarding Reminders**: Prompt incomplete users to finish setup
6. **Social Proof**: Show popular choices or recommendations
7. **Gamification**: Award bonus Mom Points for completing onboarding

### Code Enhancements
1. Add form validation feedback
2. Add loading states for each step
3. Save progress locally (localStorage) to prevent data loss
4. Add confirmation dialog before skipping
5. Add unit tests for preference mapping logic

## Files Modified

### New Files
- `src/components/OnboardingScreen.jsx`

### Modified Files
- `src/App.jsx` - Added onboarding route
- `src/components/RegisterScreen.jsx` - Changed redirect from `/` to `/onboarding`

### Backend Files (No changes needed)
- `backend/convex/users.ts` - Already has `updatePreferences` mutation
- `backend/convex/schema.ts` - Already has `userPreferences` table

## Notes
- The onboarding flow uses the existing Convex `updatePreferences` mutation
- No backend changes were required
- The component follows the existing app's design patterns
- All preferences are optional - users can skip any or all selections

