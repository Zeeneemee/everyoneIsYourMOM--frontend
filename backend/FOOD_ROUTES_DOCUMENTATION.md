# Food Routes API Documentation

Complete documentation for all food-related API endpoints.

## Base URL
```
http://localhost:3000/api/food
```

---

## Public Routes (No Authentication Required)

### 1. Get All Food Items
**Endpoint:** `GET /`

**Description:** Retrieve all food items with optional filters.

**Query Parameters:**
- `available` (boolean) - Filter by availability
- `diet` (string) - Filter by diet type
- `tags` (string) - Filter by tags
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `cuisine` (string) - Filter by cuisine type
- `rating` (number) - Minimum rating

**Example Request:**
```bash
GET /api/food?available=true&diet=vegan&maxPrice=10
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

---

### 2. Search Food Items
**Endpoint:** `GET /search`

**Description:** Search food items by query term and filters.

**Query Parameters:**
- `q` (string) - Search term
- `diet` (string, comma-separated) - Dietary preferences
- `tags` (string, comma-separated) - Food tags
- `excludeAllergens` (string, comma-separated) - Allergens to exclude
- `maxPrice` (number) - Maximum price
- `maxEta` (number) - Maximum ETA in minutes

**Example Request:**
```bash
GET /api/food/search?q=chicken&diet=halal&maxPrice=15
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 12
}
```

---

### 3. Get Food Recommendations
**Endpoint:** `GET /recommendations`

**Description:** Get personalized food recommendations based on preferences.

**Query Parameters:**
- `diet` (string, comma-separated) - Dietary preferences
- `tags` (string, comma-separated) - Preferred tags
- `allergens` (string, comma-separated) - Allergens to avoid
- `maxDistance` (number) - Maximum distance in km

**Example Request:**
```bash
GET /api/food/recommendations?diet=vegan,vegetarian&maxDistance=2
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

### 4. Get Nearby Food
**Endpoint:** `GET /nearby`

**Description:** Get food items near a specific block/location.

**Query Parameters:**
- `block` (string, required) - Block number or location
- `radius` (number) - Search radius in km (default: 1.0)

**Example Request:**
```bash
GET /api/food/nearby?block=123A&radius=0.5
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 8
}
```

---

### 5. Get Food by Category/Cuisine
**Endpoint:** `GET /category/:category`

**Description:** Get all food items of a specific category or cuisine.

**URL Parameters:**
- `category` (string) - Category name (e.g., 'chinese', 'indian', 'western')

**Example Request:**
```bash
GET /api/food/category/chinese
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 15,
  "category": "chinese"
}
```

---

### 6. Get Food by Dietary Preference
**Endpoint:** `GET /diet/:diet`

**Description:** Get all food items matching a specific dietary preference.

**URL Parameters:**
- `diet` (string) - Diet type (e.g., 'vegan', 'vegetarian', 'halal', 'gluten-free')

**Example Request:**
```bash
GET /api/food/diet/vegan
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 20,
  "diet": "vegan"
}
```

---

### 7. Get Food by Price Range
**Endpoint:** `GET /price-range`

**Description:** Get food items within a specific price range.

**Query Parameters:**
- `min` (number) - Minimum price
- `max` (number) - Maximum price

**Example Request:**
```bash
GET /api/food/price-range?min=5&max=15
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 30,
  "priceRange": {
    "min": 5,
    "max": 15
  }
}
```

---

### 8. Get Featured Food Items
**Endpoint:** `GET /featured`

**Description:** Get featured or highly-rated food items.

**Example Request:**
```bash
GET /api/food/featured
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

### 9. Get Trending Food Items
**Endpoint:** `GET /trending`

**Description:** Get trending food items based on orders or views.

**Example Request:**
```bash
GET /api/food/trending
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

### 10. Get Food by ID
**Endpoint:** `GET /:id`

**Description:** Get detailed information about a specific food item.

**URL Parameters:**
- `id` (string) - Food item ID

**Example Request:**
```bash
GET /api/food/j97d4h8pz3rnrx9wfh9wg6n24r71hqx7
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "j97d4h8pz3rnrx9wfh9wg6n24r71hqx7",
    "dishName": "Chicken Rice",
    "price": 8.5,
    "rating": 4.5,
    ...
  }
}
```

---

## Authenticated Routes (Requires Authentication)

### 11. Create Food Offering
**Endpoint:** `POST /`

**Description:** Create a new food offering.

**Authentication:** Required

**Request Body:**
```json
{
  "dishName": "Chicken Rice",
  "price": 8.5,
  "cuisine": "chinese",
  "diet": ["halal"],
  "description": "Delicious chicken rice",
  "imageUrl": "https://...",
  "available": true,
  "quantity": 10,
  "block": "123A",
  "eta": "20 mins",
  "tags": ["popular", "quick"]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Food offering created successfully"
}
```

---

### 12. Update Food Offering
**Endpoint:** `PUT /:id`

**Description:** Update an existing food offering.

**Authentication:** Required

**URL Parameters:**
- `id` (string) - Food item ID

**Request Body:** (any fields to update)
```json
{
  "price": 9.0,
  "available": false
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Food offering updated successfully"
}
```

---

### 13. Delete Food Offering
**Endpoint:** `DELETE /:id`

**Description:** Delete a food offering.

**Authentication:** Required

**URL Parameters:**
- `id` (string) - Food item ID

**Example Response:**
```json
{
  "success": true,
  "message": "Food offering deleted successfully"
}
```

---

### 14. Get User's Food Listings
**Endpoint:** `GET /user/my-listings`

**Description:** Get all food listings created by the authenticated user.

**Authentication:** Required

**Example Request:**
```bash
GET /api/food/user/my-listings
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### 15. Toggle Food Availability
**Endpoint:** `PATCH /:id/availability`

**Description:** Toggle the availability status of a food item.

**Authentication:** Required

**URL Parameters:**
- `id` (string) - Food item ID

**Example Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Food availability enabled"
}
```

---

### 16. Update Food Quantity
**Endpoint:** `PATCH /:id/quantity`

**Description:** Update the quantity of a food item.

**Authentication:** Required

**URL Parameters:**
- `id` (string) - Food item ID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Food quantity updated successfully"
}
```

---

### 17. Bulk Create Food Items
**Endpoint:** `POST /bulk/create`

**Description:** Create multiple food items at once.

**Authentication:** Required

**Request Body:**
```json
{
  "foods": [
    {
      "dishName": "Chicken Rice",
      "price": 8.5,
      ...
    },
    {
      "dishName": "Nasi Lemak",
      "price": 7.0,
      ...
    }
  ]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 2,
  "message": "2 food items created successfully"
}
```

---

### 18. Bulk Update Food Items
**Endpoint:** `PATCH /bulk/update`

**Description:** Update multiple food items at once.

**Authentication:** Required

**Request Body:**
```json
{
  "updates": [
    {
      "id": "abc123",
      "data": { "price": 9.0 }
    },
    {
      "id": "def456",
      "data": { "available": false }
    }
  ]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 2,
  "message": "2 food items updated successfully"
}
```

---

### 19. Bulk Delete Food Items
**Endpoint:** `DELETE /bulk/delete`

**Description:** Delete multiple food items at once.

**Authentication:** Required

**Request Body:**
```json
{
  "ids": ["abc123", "def456", "ghi789"]
}
```

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "message": "3 food items deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

For authenticated routes, include the authentication token in the request headers:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Or as a cookie:
```
Cookie: token=YOUR_TOKEN_HERE
```

---

## Rate Limiting

(Add your rate limiting details here if applicable)

---

## Notes

1. All responses include a `success` boolean field
2. Data arrays include a `count` field with the number of items
3. Dates are returned in ISO 8601 format
4. Prices are in the local currency
5. Distance/radius are in kilometers
6. ETA is in minutes

---

## Examples Using cURL

### Get all vegan food under $10
```bash
curl -X GET "http://localhost:3000/api/food/search?diet=vegan&maxPrice=10"
```

### Create a new food item
```bash
curl -X POST http://localhost:3000/api/food \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dishName": "Vegan Burger",
    "price": 12.5,
    "cuisine": "western",
    "diet": ["vegan"],
    "available": true
  }'
```

### Update food quantity
```bash
curl -X PATCH http://localhost:3000/api/food/abc123/quantity \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'
```

---

## Support

For issues or questions, please contact the development team or open an issue in the repository.

