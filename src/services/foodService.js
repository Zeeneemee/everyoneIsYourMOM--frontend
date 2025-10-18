/**
 * Food Service - API calls for food-related operations
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get food card by query (dish name)
 * @param {string} query - Dish name to search for
 * @returns {Promise<Object>} Food card data
 */
export async function getFoodCardByQuery(query) {
  try {
    const response = await fetch(
      `${API_BASE}/food/card?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch food card');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching food card:', error);
    throw error;
  }
}

/**
 * Get food item by ID
 * @param {string} id - Food item ID
 * @returns {Promise<Object>} Food item data
 */
export async function getFoodById(id) {
  try {
    const response = await fetch(`${API_BASE}/food/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch food item');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching food by ID:', error);
    throw error;
  }
}

/**
 * Get all food items
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Food items data
 */
export async function getAllFood(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const url = `${API_BASE}/food${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch food items');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching all food:', error);
    throw error;
  }
}

/**
 * Search food items
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} Search results
 */
export async function searchFood(searchParams) {
  try {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/food/search?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to search food');
    }
    
    return data;
  } catch (error) {
    console.error('Error searching food:', error);
    throw error;
  }
}

/**
 * Get food recommendations
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Recommended food items
 */
export async function getFoodRecommendations(preferences = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(preferences).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/food/recommendations?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get recommendations');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

/**
 * Get nearby food items
 * @param {string} block - Block number
 * @param {number} radius - Search radius in km
 * @returns {Promise<Object>} Nearby food items
 */
export async function getNearbyFood(block, radius = 1.0) {
  try {
    const response = await fetch(
      `${API_BASE}/food/nearby?block=${encodeURIComponent(block)}&radius=${radius}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get nearby food');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting nearby food:', error);
    throw error;
  }
}

/**
 * Get food by category
 * @param {string} category - Category name
 * @returns {Promise<Object>} Food items in category
 */
export async function getFoodByCategory(category) {
  try {
    const response = await fetch(`${API_BASE}/food/category/${encodeURIComponent(category)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get food by category');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting food by category:', error);
    throw error;
  }
}

/**
 * Get featured food items
 * @returns {Promise<Object>} Featured food items
 */
export async function getFeaturedFood() {
  try {
    const response = await fetch(`${API_BASE}/food/featured`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get featured food');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting featured food:', error);
    throw error;
  }
}

/**
 * Get trending food items
 * @returns {Promise<Object>} Trending food items
 */
export async function getTrendingFood() {
  try {
    const response = await fetch(`${API_BASE}/food/trending`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get trending food');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting trending food:', error);
    throw error;
  }
}

/**
 * Helper to ensure array format
 * @param {any} value - Value to convert to array
 * @returns {Array} Array value
 */
function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return [];
}

/**
 * Transform backend food data to frontend format
 * @param {Object} food - Food data from backend
 * @returns {Object} Transformed food data
 */
export function transformFoodData(food) {
  if (!food) return null;
  
  return {
    id: food.id || food._id,
    itemId: food.itemId,
    name: food.dishName || food.dish || 'Unknown Dish',
    house: food.house || 'Unknown',
    block: food.block || '',
    description: food.description || '',
    tags: ensureArray(food.tags),
    diet: ensureArray(food.diet),
    allergens: ensureArray(food.allergens),
    price: food.price || '$0',
    eta: food.eta || '30 min',
    distance: food.distance || '1 km',
    rating: food.rating || 5.0,
    calories: food.calories || '500 cal',
    protein: food.protein || '20g',
    image: food.image || '',
    available: food.available !== false,
    _creationTime: food._creationTime,
  };
}

