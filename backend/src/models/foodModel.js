import { convexClient } from '../utils/convexClient.js';
import { api } from '../../convex/_generated/api.js';

export class FoodModel {
  /**
   * Get all food items
   */
  async getAll(filters = {}) {
    try {
      return await convexClient.query(api.foods.getAll, {
        available: filters.available,
      });
    } catch (error) {
      console.error('Error getting all food items:', error);
      throw error;
    }
  }

  /**
   * Get food by ID
   */
  async getById(id) {
    try {
      return await convexClient.query(api.foods.getById, { id });
    } catch (error) {
      console.error('Error getting food by ID:', error);
      throw error;
    }
  }

  /**
   * Create new food item
   */
  async create(data) {
    try {
      return await convexClient.mutation(api.foods.create, data);
    } catch (error) {
      console.error('Error creating food item:', error);
      throw error;
    }
  }

  /**
   * Update food item
   */
  async update(id, data) {
    try {
      return await convexClient.mutation(api.foods.update, { id, data });
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  }

  /**
   * Delete food item
   */
  async delete(id) {
    try {
      await convexClient.mutation(api.foods.remove, { id });
      return { success: true };
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  }

  /**
   * Search food by dish name
   */
  async searchByName(searchTerm) {
    try {
      return await convexClient.query(api.foods.searchByName, { searchTerm });
    } catch (error) {
      console.error('Error searching food by name:', error);
      throw error;
    }
  }

  /**
   * Search food by dietary preferences and allergens
   */
  async searchByDiet(preferences = {}) {
    try {
      const { diet, excludeAllergens, tags, maxPrice, maxEta } = preferences;
      
      return await convexClient.query(api.foods.searchByDiet, {
        diet,
        excludeAllergens,
        tags,
        maxPrice,
        maxEta,
      });
    } catch (error) {
      console.error('Error searching food by diet:', error);
      throw error;
    }
  }

  /**
   * Get food recommendations based on user preferences
   */
  async getRecommendations(userId, preferences = {}) {
    try {
      const foods = await this.getAll({ available: true });
      
      // Score and rank based on preferences
      const scored = foods.map(food => {
        let score = 0;
        
        // Diet match
        if (preferences.diet && food.diet) {
          if (food.diet.some(d => preferences.diet.includes(d))) {
            score += 10;
          }
        }
        
        // Tag preferences
        if (preferences.preferredTags && food.tags) {
          const matchingTags = food.tags.filter(tag => 
            preferences.preferredTags.includes(tag)
          );
          score += matchingTags.length * 5;
        }
        
        // Avoid allergens (high penalty)
        if (preferences.allergens && food.allergens) {
          const hasAllergen = food.allergens.some(allergen =>
            preferences.allergens.includes(allergen)
          );
          if (hasAllergen) {
            score -= 100;
          }
        }
        
        // Distance preference (closer is better)
        if (preferences.maxDistance && food.distance) {
          const distance = parseFloat(food.distance.replace(' km', '') || '999');
          if (distance <= preferences.maxDistance) {
            score += (preferences.maxDistance - distance) * 2;
          }
        }
        
        return { ...food, score };
      });
      
      // Filter out items with negative scores and sort by score
      return scored
        .filter(item => item.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting food recommendations:', error);
      throw error;
    }
  }

  /**
   * Get nearby food options by block
   */
  async getNearbyFood(block, radius = 1.0) {
    try {
      return await convexClient.query(api.foods.getNearbyFood, { block, radius });
    } catch (error) {
      console.error('Error getting nearby food:', error);
      throw error;
    }
  }

  /**
   * Get food by block
   */
  async getByBlock(block) {
    try {
      const foods = await this.getAll({ available: true });
      return foods.filter(food => food.block === block);
    } catch (error) {
      console.error('Error getting food by block:', error);
      throw error;
    }
  }
}

export const foodModel = new FoodModel();
export default foodModel;
