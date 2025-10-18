# Food Card Route - Quick Reference

## Get Food Card by Query

This route allows you to search for food items by name and get complete card data from Convex.

### Endpoint
```
GET /api/food/card?query={searchTerm}
```

### Examples

#### 1. Search for "Chicken Rice"
```bash
curl "http://localhost:3000/api/food/card?query=chicken%20rice"
```

#### 2. Search for "Nasi Lemak"
```bash
curl "http://localhost:3000/api/food/card?query=nasi%20lemak"
```

#### 3. Search for any dish
```bash
curl "http://localhost:3000/api/food/card?query=burger"
```

### Response Format

**Success Response (200 OK):**
```json
{
  "success": true,
  "query": "chicken rice",
  "data": [
    {
      "id": "j97d4h8pz3rnrx9wfh9wg6n24r71hqx7",
      "itemId": "f1",
      "dishName": "Hainanese Chicken Rice",
      "house": "Auntie Lin's Kitchen",
      "block": "Block 123A",
      "description": "Delicious Hainanese Chicken Rice from Auntie Lin's Kitchen",
      "tags": ["comfort food", "local favorite"],
      "diet": ["halal"],
      "allergens": ["soy"],
      "price": "$8.50",
      "eta": "20 min",
      "distance": "0.3 km",
      "rating": 4.8,
      "calories": "650 cal",
      "protein": "35g protein",
      "image": "https://...",
      "available": true,
      "_creationTime": 1698765432000
    }
  ],
  "count": 1
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "error": "No food items found matching \"xyz\""
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "error": "Query parameter is required"
}
```

### Data Mapping from Convex

The route automatically maps Convex data to a clean card format:

| Convex Field | Response Field | Description |
|--------------|----------------|-------------|
| `_id` | `id` | Convex document ID |
| `itemId` | `itemId` | Original item ID from data |
| `dish` | `dishName` | Name of the dish |
| `house` | `house` | Provider's name |
| `block` | `block` | Location block |
| `description` | `description` | Food description |
| `tags` | `tags` | Array of tags |
| `diet` | `diet` | Dietary categories |
| `allergens` | `allergens` | List of allergens |
| `price` | `price` | Price with currency |
| `eta` | `eta` | Estimated time |
| `distance` | `distance` | Distance from user |
| `rating` | `rating` | Rating score |
| `calories` | `calories` | Calorie information |
| `protein` | `protein` | Protein content |
| `image` | `image` | Image URL |
| `available` | `available` | Availability status |
| `_creationTime` | `_creationTime` | Creation timestamp |

### Use Cases

1. **Voice Search**: When user says "Show me chicken rice"
2. **Quick Search**: Direct dish lookup by name
3. **Card Display**: Get all data needed to display food card
4. **Autocomplete**: Search as user types

### JavaScript Fetch Example

```javascript
// Simple fetch
const query = "chicken rice";
const response = await fetch(`http://localhost:3000/api/food/card?query=${encodeURIComponent(query)}`);
const data = await response.json();

if (data.success) {
  console.log(`Found ${data.count} items:`, data.data);
} else {
  console.error(data.error);
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useFoodCard(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchFoodCard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/food/card?query=${encodeURIComponent(query)}`
        );
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodCard();
  }, [query]);

  return { data, loading, error };
}

// Usage in component
function FoodCardSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useFoodCard(searchTerm);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for food..."
      />
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && data.map(item => (
        <FoodCard key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Testing

Test the route with different queries:

```bash
# Test 1: Simple search
curl "http://localhost:3000/api/food/card?query=chicken"

# Test 2: Multi-word search
curl "http://localhost:3000/api/food/card?query=nasi%20lemak"

# Test 3: No query (should return 400)
curl "http://localhost:3000/api/food/card"

# Test 4: Non-existent dish (should return 404)
curl "http://localhost:3000/api/food/card?query=xyz123"
```

### Notes

- The search is **case-insensitive**
- Partial matches are supported (e.g., "chicken" will match "Chicken Rice", "Fried Chicken", etc.)
- Returns all matching items as an array
- The `count` field shows how many items were found
- The search uses the Convex `searchByName` function which filters by dish name

