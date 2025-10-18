import { foodModel } from '../models/foodModel.js';

export class FoodController {
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
   * Get food by ID
   */
  async getFoodById(req, res) {
    try {
      const { id } = req.params;
      const food = await foodModel.getById(id);
      
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
}

export const foodController = new FoodController();
export default foodController;

