# Quick Start Guide

## Prerequisites
- Node.js installed
- npm or yarn installed

## Setup Steps (5 minutes)

### 1. Create Environment Files

**Create `/backend/.env`:**
```bash
cd backend
cat > .env << 'EOF'
CONVEX_URL=https://your-project.convex.cloud
JWT_SECRET=my-super-secret-key-change-this-in-production
PORT=3000
EOF
```

**Create `/.env` (frontend root):**
```bash
cd ..
cat > .env << 'EOF'
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_API_URL=http://localhost:3000/api
EOF
```

### 2. Initialize Convex (First Time Only)

```bash
cd backend
npx convex dev
```

Follow the prompts to:
- Sign up/login to Convex
- Create a new project
- Copy the CONVEX_URL shown

**Update both `.env` files with the real CONVEX_URL**

### 3. Install Dependencies

```bash
# Backend (if not already done)
cd backend
npm install

# Frontend (if not already done)
cd ..
npm install
```

### 4. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Convex (keep running):**
```bash
cd backend
npx convex dev
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

### 5. Open the App

Visit http://localhost:5173 (or the URL shown in Terminal 3)

### 6. Register & Test

1. Click "Register here" or go to `/register`
2. Create an account (email + password)
3. You'll be logged in automatically
4. Data from `data.json` will be seeded on first load
5. Try browsing and creating offerings!

## That's It! 🎉

Your app is now running with:
- ✅ JWT authentication
- ✅ Convex backend
- ✅ Real-time data
- ✅ Full CRUD functionality

## Common Commands

```bash
# Start backend dev server
cd backend && npm run dev

# Start frontend dev server
npm run dev

# Start Convex dev server
cd backend && npx convex dev

# Deploy Convex to production
cd backend && npx convex deploy

# View Convex dashboard
cd backend && npx convex dashboard
```

## Troubleshooting

**Can't connect to backend?**
- Make sure backend is running on port 3000
- Check `VITE_API_URL` in frontend `.env`

**Can't connect to Convex?**
- Make sure `npx convex dev` is running
- Check `VITE_CONVEX_URL` matches your Convex project URL
- Wait for Convex to finish deploying

**Data not loading?**
- Open browser DevTools Console
- Look for error messages
- Make sure `data.json` exists in the public folder

**Login not working?**
- Check backend console for errors
- Make sure JWT_SECRET is set in backend `.env`
- Clear localStorage and try again

Need help? Check `IMPLEMENTATION_SUMMARY.md` for more details!

