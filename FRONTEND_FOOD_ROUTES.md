# Frontend Food Routes Documentation

Complete guide for frontend food card routes and navigation.

---

## 🎯 Routes Overview

### Main Routes

1. **Food List Page**
   ```
   /food
   ```
   - Displays all food items in a grid
   - Filter by category, diet, cuisine
   - Pagination support
   - Search functionality

2. **Food Detail by ID**
   ```
   /food/:id
   ```
   - Individual food card detail page
   - Full food information
   - Order functionality
   - Example: `/food/j97d4h8pz3rnrx9wfh9wg6n24r71hqx7`

3. **Food Detail by Query**
   ```
   /food/card/:query
   ```
   - Search by dish name
   - Auto-fetch from backend API
   - Example: `/food/card/chicken%20rice`

---

## 📦 Components Created

### 1. FoodDetailPage Component
**Location:** `src/components/FoodDetailPage.jsx`

A full-page component for displaying individual food cards with:
- Hero image section
- Complete food details
- Nutrition facts
- Dietary information
- Allergen warnings
- Order functionality
- Share & favorite features
- Location details

**Usage:**
```jsx
import { FoodDetailPage } from './components/FoodDetailPage';

// Route will automatically handle
<Route path="/food/:id" element={<FoodDetailPage />} />
<Route path="/food/card/:query" element={<FoodDetailPage />} />
```

### 2. Food Service
**Location:** `src/services/foodService.js`

API service for fetching food data:
```javascript
import { 
  getFoodCardByQuery, 
  getFoodById,
  getAllFood,
  searchFood,
  getFoodRecommendations,
  transformFoodData
} from '../services/foodService';

// Get food by query
const data = await getFoodCardByQuery('chicken rice');

// Get food by ID
const food = await getFoodById('j97d4h8pz3rnrx9wfh9wg6n24r71hqx7');

// Transform data
const transformed = transformFoodData(food.data);
```

---

## 🔄 Navigation Patterns

### 1. From Food List to Detail

**In FoodScreen.jsx:**
```jsx
// Entire card is clickable
<motion.div
  onClick={() => navigate(`/food/${food.id}`, { state: { food } })}
  className="cursor-pointer"
>
  {/* Food card content */}
</motion.div>
```

**With state passing (faster):**
```jsx
navigate(`/food/${food.id}`, { 
  state: { food } // Pass existing data, avoids refetch
});
```

**Without state (will fetch):**
```jsx
navigate(`/food/${food.id}`); // Will call API
```

### 2. Direct Query Navigation

```jsx
// Navigate by dish name
navigate(`/food/card/chicken rice`);

// URL-encoded version
navigate(`/food/card/${encodeURIComponent('chicken rice')}`);
```

### 3. Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleFoodClick = (foodId, foodData) => {
    navigate(`/food/${foodId}`, { 
      state: { food: foodData } 
    });
  };
  
  return (
    <button onClick={() => handleFoodClick('id123', foodData)}>
      View Details
    </button>
  );
}
```

---

## 🎨 User Flow

### Complete Navigation Flow

```
Food List (/food)
    |
    | Click on card or "Details" button
    ↓
Food Detail Page (/food/:id)
    |
    | Click "Order Now"
    ↓
Checkout Modal
    |
    | Complete payment
    ↓
Payment Success (/payment-success)
    |
    | Track order
    ↓
Order Tracking (/order-tracking)
```

### Alternative Flow (Voice Search)

```
Voice Assistant
    |
    | User says "Show me chicken rice"
    ↓
Navigate to /food/card/chicken rice
    |
    ↓
Food Detail Page (auto-fetched)
    |
    ↓
Order Flow
```

---

## 💻 Code Examples

### Example 1: Link to Food Detail
```jsx
import { Link } from 'react-router-dom';

function FoodCard({ food }) {
  return (
    <Link 
      to={`/food/${food.id}`}
      state={{ food }}
      className="block"
    >
      <div className="food-card">
        <img src={food.image} alt={food.name} />
        <h3>{food.name}</h3>
        <p>{food.price}</p>
      </div>
    </Link>
  );
}
```

### Example 2: Programmatic with State
```jsx
import { useNavigate } from 'react-router-dom';

function FoodCard({ food }) {
  const navigate = useNavigate();
  
  const viewDetails = () => {
    navigate(`/food/${food.id}`, {
      state: { 
        food,
        returnPath: '/food' // Optional: for back navigation
      }
    });
  };
  
  return (
    <div onClick={viewDetails} className="cursor-pointer">
      {/* Food card UI */}
    </div>
  );
}
```

### Example 3: Voice Integration
```jsx
function VoiceSearch() {
  const navigate = useNavigate();
  
  const handleVoiceCommand = (query) => {
    // User said "Show me chicken rice"
    const dishName = extractDishName(query); // "chicken rice"
    
    // Navigate to card by query
    navigate(`/food/card/${encodeURIComponent(dishName)}`);
  };
  
  return (
    <button onClick={handleVoiceCommand}>
      🎤 Voice Search
    </button>
  );
}
```

### Example 4: Search Results
```jsx
function SearchResults({ results }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {results.map(food => (
        <Link 
          key={food.id}
          to={`/food/${food.id}`}
          state={{ food }}
        >
          <FoodCard food={food} />
        </Link>
      ))}
    </div>
  );
}
```

---

## 🔌 API Integration

### Data Flow

```
Frontend Component
    ↓
foodService.js (API call)
    ↓
Backend: GET /api/food/card?query=chicken rice
    ↓
Convex Database Query
    ↓
Response with food data
    ↓
transformFoodData() (Format data)
    ↓
Update Component State
    ↓
Render Food Card
```

### Service Functions

**1. Get by Query:**
```javascript
const data = await getFoodCardByQuery('chicken rice');
// Returns: { success: true, data: [...], count: 1 }
```

**2. Get by ID:**
```javascript
const data = await getFoodById('abc123');
// Returns: { success: true, data: {...} }
```

**3. Search:**
```javascript
const data = await searchFood({ 
  q: 'chicken',
  diet: 'halal',
  maxPrice: 10 
});
```

**4. Get Recommendations:**
```javascript
const data = await getFoodRecommendations({
  diet: ['vegan', 'vegetarian'],
  allergens: ['peanuts'],
  maxDistance: 2.0
});
```

---

## 🎭 State Management

### Passing State via Navigation
```jsx
// Pass entire food object to avoid refetch
navigate(`/food/${food.id}`, { 
  state: { 
    food,              // Main food data
    fromPage: '/food', // Track origin
    filters: {...}     // Previous filters
  } 
});

// Access in destination component
import { useLocation } from 'react-router-dom';

function FoodDetailPage() {
  const location = useLocation();
  const food = location.state?.food;
  const fromPage = location.state?.fromPage;
  
  // Use the data or fetch if not available
  useEffect(() => {
    if (!food) {
      fetchFoodData();
    }
  }, [food]);
}
```

---

## 🚀 Performance Optimizations

### 1. State Passing (Recommended)
```jsx
// ✅ GOOD: Pass data, no API call needed
navigate(`/food/${id}`, { state: { food } });
```

### 2. Lazy Loading
```jsx
// Already implemented in FoodDetailPage
useEffect(() => {
  if (!food) {
    // Only fetch if data not passed
    fetchFoodData();
  }
}, [food]);
```

### 3. Loading States
```jsx
// Shows loader while fetching
{loading && <Loader />}
{error && <ErrorMessage />}
{food && <FoodContent />}
```

---

## 🎨 UI Features

### FoodDetailPage Features

1. **Hero Section**
   - Full-screen food image
   - Floating badges (rating, diet, availability)
   - Share and favorite buttons
   - Back navigation

2. **Content Sections**
   - Title and price
   - House/vendor info
   - Description
   - Dietary information badges
   - Nutrition facts cards
   - Allergen warnings
   - Tags
   - Location details

3. **Actions**
   - Fixed bottom "Order Now" button
   - Smooth checkout flow
   - Payment integration

4. **Animations**
   - Page transitions
   - Smooth scrolling
   - Fade-in effects
   - Interactive hover states

---

## 🔍 URL Patterns

### Valid URLs

```
✅ /food/j97d4h8pz3rnrx9wfh9wg6n24r71hqx7
✅ /food/card/chicken%20rice
✅ /food/card/nasi%20lemak
✅ /food/card/burger
```

### Invalid URLs (will show error)

```
❌ /food/nonexistent-id
❌ /food/card/xyz123
```

---

## 🛠️ Environment Setup

### Required Environment Variables
```env
# .env or .env.local
VITE_API_URL=http://localhost:3000/api
```

### Default Fallback
If not set, defaults to:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

---

## 🧪 Testing

### Manual Testing

1. **Test Card Click:**
   ```
   1. Go to /food
   2. Click any food card
   3. Should navigate to /food/:id
   4. Check if data loads correctly
   ```

2. **Test Query Navigation:**
   ```
   1. Manually visit /food/card/chicken%20rice
   2. Should fetch and display matching food
   3. Check error handling for no results
   ```

3. **Test State Passing:**
   ```
   1. Click card from /food
   2. Page should load instantly (no loader)
   3. Back button should return to /food
   ```

### Integration Testing

```javascript
// Example test
describe('Food Navigation', () => {
  it('navigates to detail page on card click', () => {
    render(<FoodScreen />);
    const card = screen.getByText('Chicken Rice');
    fireEvent.click(card);
    expect(window.location.pathname).toBe('/food/abc123');
  });
});
```

---

## 📱 Mobile Considerations

- Full-screen detail pages
- Smooth touch interactions
- Bottom sheet modals
- Fixed action buttons
- Optimized images
- Touch-friendly buttons (min 44x44px)

---

## 🎯 Best Practices

1. **Always Pass State When Possible**
   ```jsx
   // ✅ Fast
   navigate(`/food/${id}`, { state: { food } });
   
   // ❌ Slow (unnecessary API call)
   navigate(`/food/${id}`);
   ```

2. **Handle Loading States**
   ```jsx
   {loading && <LoadingSpinner />}
   {error && <ErrorMessage error={error} />}
   {food && <FoodDetails food={food} />}
   ```

3. **Error Boundaries**
   ```jsx
   <ErrorBoundary fallback={<ErrorPage />}>
     <FoodDetailPage />
   </ErrorBoundary>
   ```

4. **SEO Friendly URLs**
   ```jsx
   // Good: descriptive
   /food/card/chicken-rice
   
   // Also good: by ID
   /food/j97d4h8pz3rnrx9wfh9wg6n24r71hqx7
   ```

---

## 📚 Related Documentation

- Backend API: `backend/FOOD_ROUTES_DOCUMENTATION.md`
- Card Route: `backend/FOOD_CARD_ROUTE.md`
- Main Summary: `FOOD_ROUTER_SUMMARY.md`

---

**Created:** October 18, 2025
**Status:** ✅ Ready to use

