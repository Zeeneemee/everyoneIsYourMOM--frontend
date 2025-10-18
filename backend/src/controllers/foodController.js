import { foodModel } from '../models/foodModel.js';

export class FoodController {
  /**
   * Get food card data by query
   * Example: GET /api/food/card?query=chicken rice
   */
  async getFoodCard(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter is required',
        });
      }
      
      // Search for the food item in Convex
      const results = await foodModel.searchByName(query);
      
      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          error: `No food items found matching "${query}"`,
        });
      }
      
      // Map Convex data to card format
      const mappedResults = results.map(food => ({
        id: food._id,
        itemId: food.itemId,
        dishName: food.dish,
        house: food.house,
        block: food.block,
        description: food.description,
        tags: food.tags || [],
        diet: food.diet || [],
        allergens: food.allergens || [],
        price: food.price,
        eta: food.eta,
        distance: food.distance,
        rating: food.rating,
        calories: food.calories,
        protein: food.protein,
        image: food.image,
        available: food.available,
        // Additional metadata
        _creationTime: food._creationTime,
      }));
      
      res.json({
        success: true,
        query,
        data: mappedResults,
        count: mappedResults.length,
      });
    } catch (error) {
      console.error('Get food card error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food card data',
      });
    }
  }

  /**
   * Get all food items
   */
  async getAllFood(req, res) {
    try {
      const { available } = req.query;
      const filters = {};
      
      if (available !== undefined) {
        filters.available = available === 'true';
      }
      
      const foods = await foodModel.getAll(filters);
      
      res.json({
        success: true,
        data: foods,
        count: foods.length,
      });
    } catch (error) {
      console.error('Get all food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food items',
      });
    }
  }

  /**
   * Get food by ID (smart detection: itemId or Convex _id)
   */
  async getFoodById(req, res) {
    try {
      const { id } = req.params;
      console.log('Looking up food by id:', id);
      
      // Smart detection: check if id is an itemId (like "food_001") or Convex _id
      const isItemId = id.includes('_') || id.startsWith('food') || id.startsWith('clean') || id.startsWith('exchange');
      
      let food;
      if (isItemId) {
        console.log('Detected as itemId, using getByItemId');
        food = await foodModel.getByItemId(id);
      } else {
        console.log('Detected as Convex _id, using getById');
        food = await foodModel.getById(id);
      }
      
      if (!food) {
        return res.status(404).json({
          success: false,
          error: 'Food item not found',
        });
      }
      
      res.json({
        success: true,
        data: food,
      });
    } catch (error) {
      console.error('Get food by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food item',
      });
    }
  }

  /**
   * Get food by itemId (Convex itemId field)
   */
  async getFoodByItemId(req, res) {
    try {
      const { itemId } = req.params;
      console.log('Looking up food by itemId:', itemId);
      
      const food = await foodModel.getByItemId(itemId);
      
      if (!food) {
        return res.status(404).json({
          success: false,
          error: 'Food item not found',
        });
      }
      
      res.json({
        success: true,
        data: food,
      });
    } catch (error) {
      console.error('Get food by itemId error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food item',
      });
    }
  }

  /**
   * Search food
   */
  async searchFood(req, res) {
    try {
      const { q, diet, tags, excludeAllergens, maxPrice, maxEta } = req.query;
      
      let results = [];
      
      if (q) {
        // Text search by name
        results = await foodModel.searchByName(q);
      } else {
        // Search by dietary preferences
        const preferences = {
          diet: diet ? diet.split(',') : [],
          tags: tags ? tags.split(',') : [],
          excludeAllergens: excludeAllergens ? excludeAllergens.split(',') : [],
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          maxEta: maxEta ? parseInt(maxEta) : undefined,
        };
        
        results = await foodModel.searchByDiet(preferences);
      }
      
      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      console.error('Search food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search food items',
      });
    }
  }

  /**
   * Get food recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user?.id; // From auth middleware
      const { diet, tags, allergens, maxDistance } = req.query;
      
      const preferences = {
        diet: diet ? diet.split(',') : [],
        preferredTags: tags ? tags.split(',') : [],
        allergens: allergens ? allergens.split(',') : [],
        maxDistance: maxDistance ? parseFloat(maxDistance) : 1.0,
      };
      
      const recommendations = await foodModel.getRecommendations(userId, preferences);
      
      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
      });
    } catch (error) {
      console.error('Get food recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations',
      });
    }
  }

  /**
   * Get nearby food
   */
  async getNearbyFood(req, res) {
    try {
      const { block, radius } = req.query;
      
      if (!block) {
        return res.status(400).json({
          success: false,
          error: 'Block parameter is required',
        });
      }
      
      const foods = await foodModel.getNearbyFood(
        block,
        radius ? parseFloat(radius) : 1.0
      );
      
      res.json({
        success: true,
        data: foods,
        count: foods.length,
      });
    } catch (error) {
      console.error('Get nearby food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get nearby food',
      });
    }
  }

  /**
   * Create food offering
   */
  async createFood(req, res) {
    try {
      const userId = req.user?.id;
      const foodData = {
        ...req.body,
        userId,
      };
      
      const newFood = await foodModel.create(foodData);
      
      res.status(201).json({
        success: true,
        data: newFood,
        message: 'Food offering created successfully',
      });
    } catch (error) {
      console.error('Create food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create food offering',
      });
    }
  }

  /**
   * Update food offering
   */
  async updateFood(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedFood = await foodModel.update(id, updates);
      
      res.json({
        success: true,
        data: updatedFood,
        message: 'Food offering updated successfully',
      });
    } catch (error) {
      console.error('Update food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update food offering',
      });
    }
  }

  /**
   * Delete food offering
   */
  async deleteFood(req, res) {
    try {
      const { id } = req.params;
      
      await foodModel.delete(id);
      
      res.json({
        success: true,
        message: 'Food offering deleted successfully',
      });
    } catch (error) {
      console.error('Delete food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete food offering',
      });
    }
  }

  /**
   * Get food by category/cuisine
   */
  async getFoodByCategory(req, res) {
    try {
      const { category } = req.params;
      const foods = await foodModel.getAll({ available: true });
      
      const filtered = foods.filter(food => 
        food.cuisine?.toLowerCase() === category.toLowerCase() ||
        food.category?.toLowerCase() === category.toLowerCase()
      );
      
      res.json({
        success: true,
        data: filtered,
        count: filtered.length,
        category,
      });
    } catch (error) {
      console.error('Get food by category error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food by category',
      });
    }
  }

  /**
   * Get food by dietary preference
   */
  async getFoodByDiet(req, res) {
    try {
      const { diet } = req.params;
      const foods = await foodModel.getAll({ available: true });
      
      const filtered = foods.filter(food => 
        food.diet && Array.isArray(food.diet) && 
        food.diet.some(d => d.toLowerCase() === diet.toLowerCase())
      );
      
      res.json({
        success: true,
        data: filtered,
        count: filtered.length,
        diet,
      });
    } catch (error) {
      console.error('Get food by diet error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food by diet',
      });
    }
  }

  /**
   * Get food by price range
   */
  async getFoodByPriceRange(req, res) {
    try {
      const { min, max } = req.query;
      const foods = await foodModel.getAll({ available: true });
      
      const minPrice = min ? parseFloat(min) : 0;
      const maxPrice = max ? parseFloat(max) : Infinity;
      
      const filtered = foods.filter(food => {
        const price = parseFloat(food.price);
        return price >= minPrice && price <= maxPrice;
      });
      
      res.json({
        success: true,
        data: filtered,
        count: filtered.length,
        priceRange: { min: minPrice, max: maxPrice },
      });
    } catch (error) {
      console.error('Get food by price range error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch food by price range',
      });
    }
  }

  /**
   * Get featured/popular food items
   */
  async getFeaturedFood(req, res) {
    try {
      const foods = await foodModel.getAll({ available: true });
      
      // Get featured items (you can add a "featured" field in your schema)
      const featured = foods
        .filter(food => food.featured || food.rating >= 4.5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10);
      
      res.json({
        success: true,
        data: featured,
        count: featured.length,
      });
    } catch (error) {
      console.error('Get featured food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch featured food',
      });
    }
  }

  /**
   * Get trending food items
   */
  async getTrendingFood(req, res) {
    try {
      const foods = await foodModel.getAll({ available: true });
      
      // Sort by orders count or views (you can add these fields)
      const trending = foods
        .filter(food => food.ordersCount || food.viewsCount)
        .sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
        .slice(0, 10);
      
      res.json({
        success: true,
        data: trending,
        count: trending.length,
      });
    } catch (error) {
      console.error('Get trending food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trending food',
      });
    }
  }

  /**
   * Get user's own food listings
   */
  async getUserFoodListings(req, res) {
    try {
      const userId = req.user.id;
      const foods = await foodModel.getAll();
      
      const userFoods = foods.filter(food => food.userId === userId);
      
      res.json({
        success: true,
        data: userFoods,
        count: userFoods.length,
      });
    } catch (error) {
      console.error('Get user food listings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user food listings',
      });
    }
  }

  /**
   * Toggle food availability
   */
  async toggleAvailability(req, res) {
    try {
      const { id } = req.params;
      const food = await foodModel.getById(id);
      
      if (!food) {
        return res.status(404).json({
          success: false,
          error: 'Food item not found',
        });
      }
      
      const updatedFood = await foodModel.update(id, {
        available: !food.available,
      });
      
      res.json({
        success: true,
        data: updatedFood,
        message: `Food availability ${updatedFood.available ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Toggle availability error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle food availability',
      });
    }
  }

  /**
   * Update food quantity
   */
  async updateQuantity(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (quantity === undefined || quantity < 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid quantity is required',
        });
      }
      
      const updatedFood = await foodModel.update(id, { quantity });
      
      res.json({
        success: true,
        data: updatedFood,
        message: 'Food quantity updated successfully',
      });
    } catch (error) {
      console.error('Update quantity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update food quantity',
      });
    }
  }

  /**
   * Bulk create food items
   */
  async bulkCreateFood(req, res) {
    try {
      const { foods } = req.body;
      const userId = req.user.id;
      
      if (!Array.isArray(foods) || foods.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Foods array is required',
        });
      }
      
      const results = await Promise.all(
        foods.map(foodData => 
          foodModel.create({ ...foodData, userId })
        )
      );
      
      res.status(201).json({
        success: true,
        data: results,
        count: results.length,
        message: `${results.length} food items created successfully`,
      });
    } catch (error) {
      console.error('Bulk create food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk create food items',
      });
    }
  }

  /**
   * Bulk update food items
   */
  async bulkUpdateFood(req, res) {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Updates array is required',
        });
      }
      
      const results = await Promise.all(
        updates.map(({ id, data }) => 
          foodModel.update(id, data)
        )
      );
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        message: `${results.length} food items updated successfully`,
      });
    } catch (error) {
      console.error('Bulk update food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk update food items',
      });
    }
  }

  /**
   * Bulk delete food items
   */
  async bulkDeleteFood(req, res) {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'IDs array is required',
        });
      }
      
      await Promise.all(
        ids.map(id => foodModel.delete(id))
      );
      
      res.json({
        success: true,
        count: ids.length,
        message: `${ids.length} food items deleted successfully`,
      });
    } catch (error) {
      console.error('Bulk delete food error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk delete food items',
      });
    }
  }
}

export const foodController = new FoodController();
export default foodController;

