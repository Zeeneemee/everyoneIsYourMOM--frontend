# Onboarding Completion Tracking

## Problem Solved
**User Request:** "If the user login, don't need to show the form but if the user register, let them do form"

## Solution Implemented

### Smart Onboarding Flow
✅ **New Users (Register)** → See onboarding form  
✅ **Existing Users (Login)** → Go directly to home  
✅ **Already Completed** → Never see it again  

## How It Works

### 1. Database Schema Change
Added `onboardingCompleted` field to the `users` table:

```typescript
// backend/convex/schema.ts
users: defineTable({
  email: v.string(),
  fullName: v.optional(v.string()),
  block: v.optional(v.string()),
  unit: v.optional(v.string()),
  phoneNumber: v.optional(v.string()),
  momPoints: v.number(),
  onboardingCompleted: v.optional(v.boolean()), // ← NEW
})
```

### 2. New Convex Mutation
Added a mutation to mark onboarding as completed:

```typescript
// backend/convex/users.ts
export const completeOnboarding = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { onboardingCompleted: true });
    return await ctx.db.get(args.userId);
  },
});
```

### 3. Frontend Check
The `OnboardingScreen` now checks if onboarding is already completed:

```javascript
// src/components/OnboardingScreen.jsx
useEffect(() => {
  if (user?.onboardingCompleted) {
    // User has already completed onboarding, redirect to home
    navigate('/home');
  }
}, [user, navigate]);
```

### 4. Mark as Complete
When user finishes onboarding, it's marked as completed:

```javascript
// Save preferences
await mutateConvex('users:updatePreferences', { ... });

// Mark onboarding as completed
await mutateConvex('users:completeOnboarding', {
  userId: user.id,
});
```

### 5. Backend Updates
All auth endpoints now include the `onboardingCompleted` field:
- Registration endpoint
- Login endpoint  
- Token verification endpoint
- Get profile endpoint

## User Flow Diagram

```
┌─────────────┐
│   Register  │
└──────┬──────┘
       │
       v
┌─────────────────┐
│  Onboarding     │
│  (4 steps)      │
└──────┬──────────┘
       │
       v
┌─────────────────┐
│  Mark Complete  │
│  (flag = true)  │
└──────┬──────────┘
       │
       v
┌─────────────────┐
│     Home        │
└─────────────────┘
```

```
┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       v
┌─────────────────┐
│  Check flag     │
│  (already true) │
└──────┬──────────┘
       │
       v
┌─────────────────┐
│  Skip to Home   │
└─────────────────┘
```

## Files Modified

### Backend Changes
1. ✅ `backend/convex/schema.ts` - Added `onboardingCompleted` field
2. ✅ `backend/convex/schema.js` - Compiled version
3. ✅ `backend/convex/users.ts` - Added `completeOnboarding` mutation
4. ✅ `backend/convex/users.js` - Compiled version
5. ✅ `backend/src/controllers/authController.js` - Include field in all responses

### Frontend Changes
1. ✅ `src/components/OnboardingScreen.jsx` - Check completion & mark as done
2. ✅ `src/components/LoginScreen.jsx` - Already navigates to `/` (home)
3. ✅ `src/components/RegisterScreen.jsx` - Already navigates to `/onboarding`

### Documentation
1. ✅ `ONBOARDING_QUICK_START.md` - Updated with new behavior
2. ✅ `ONBOARDING_COMPLETION_TRACKING.md` - This file

## Testing

### Test Case 1: New User Registration
1. Go to `/register`
2. Fill in form and submit
3. **Expected:** Redirect to `/onboarding`
4. Complete all 4 steps
5. **Expected:** Redirect to `/home`
6. Check Convex DB: `onboardingCompleted` = `true`

### Test Case 2: Existing User Login
1. Go to `/login`
2. Enter credentials and submit
3. **Expected:** Redirect directly to `/home` (skip onboarding)

### Test Case 3: Try to Access Onboarding After Completion
1. User who already completed onboarding
2. Manually navigate to `/onboarding`
3. **Expected:** Auto-redirect to `/home`

### Test Case 4: New User Skips Onboarding
1. New user at `/onboarding`
2. Click "Skip for now"
3. **Expected:** Go to `/home` but `onboardingCompleted` is still `false`
4. Can access `/onboarding` again later if needed

## Edge Cases Handled

✅ **User skips onboarding** → Can access it again later  
✅ **User completes onboarding** → Never shown again  
✅ **User tries manual URL** → Redirected if already completed  
✅ **Login flow** → Bypasses onboarding entirely  
✅ **Register flow** → Always shows onboarding  

## Future Enhancements

### Optional Improvements
1. **Re-onboarding**: Add a "Reset Preferences" option in settings
2. **Progress Tracking**: Save partial progress if user exits mid-flow
3. **Reminder**: Prompt users who skipped to complete onboarding
4. **Analytics**: Track completion rates and drop-off points
5. **A/B Testing**: Test different onboarding flows

### Code Improvements
1. Add loading state while checking completion status
2. Add error handling for failed mutations
3. Cache completion status in context
4. Add unit tests for onboarding logic

## Database Migration Note

**IMPORTANT:** If you have existing users in your database, they will have `onboardingCompleted: undefined` or `false`. This means:
- They will see the onboarding form on next login
- This is expected behavior (gives existing users chance to set preferences)
- If you want to skip for existing users, manually set their flag to `true` in Convex dashboard

## Summary

The onboarding system now intelligently determines whether to show the form:
- ✅ New registrations always see it
- ✅ Logins skip it
- ✅ Completed users never see it again
- ✅ Skipped users can access it later

This provides the best user experience for both new and returning users!

