import { convexClient } from '../utils/convexClient.js';
import { api } from '../../convex/_generated/api.js';

export class ExchangeModel {
  /**
   * Get all exchange items
   */
  async getAll(filters = {}) {
    try {
      return await convexClient.query(api.exchange.getAll, {
        available: filters.available,
        status: filters.status,
      });
    } catch (error) {
      console.error('Error getting all exchange items:', error);
      throw error;
    }
  }

  /**
   * Get item by ID
   */
  async getById(id) {
    try {
      return await convexClient.query(api.exchange.getById, { id });
    } catch (error) {
      console.error('Error getting item by ID:', error);
      throw error;
    }
  }

  /**
   * Create new exchange item
   */
  async create(data) {
    try {
      return await convexClient.mutation(api.exchange.create, data);
    } catch (error) {
      console.error('Error creating exchange item:', error);
      throw error;
    }
  }

  /**
   * Update exchange item
   */
  async update(id, data) {
    try {
      return await convexClient.mutation(api.exchange.update, { id, data });
    } catch (error) {
      console.error('Error updating exchange item:', error);
      throw error;
    }
  }

  /**
   * Delete exchange item
   */
  async delete(id) {
    try {
      await convexClient.mutation(api.exchange.remove, { id });
      return { success: true };
    } catch (error) {
      console.error('Error deleting exchange item:', error);
      throw error;
    }
  }

  /**
   * Search items by criteria
   */
  async searchItems(criteria = {}) {
    try {
      return await convexClient.query(api.exchange.searchItems, criteria);
    } catch (error) {
      console.error('Error searching exchange items:', error);
      throw error;
    }
  }

  /**
   * Get items by status (donate, exchange, sell)
   */
  async getByStatus(status) {
    try {
      return await this.getAll({ status, available: true });
    } catch (error) {
      console.error('Error getting items by status:', error);
      throw error;
    }
  }

  /**
   * Post a new item for exchange/donate/sell
   */
  async postItem(userId, itemData) {
    try {
      return await this.create({
        ...itemData,
        userId,
      });
    } catch (error) {
      console.error('Error posting exchange item:', error);
      throw error;
    }
  }

  /**
   * Get user's posted items
   */
  async getUserItems(userId) {
    try {
      return await convexClient.query(api.exchange.getUserItems, { userId });
    } catch (error) {
      console.error('Error getting user items:', error);
      throw error;
    }
  }

  /**
   * Mark item as claimed/reserved
   */
  async claimItem(itemId, claimedByUserId, message = '') {
    try {
      return await convexClient.mutation(api.exchange.claimItem, {
        itemId,
        claimedBy: claimedByUserId,
        message,
      });
    } catch (error) {
      console.error('Error claiming item:', error);
      throw error;
    }
  }

  /**
   * Get item recommendations based on user needs
   */
  async getRecommendations(userId, searchTerm = '', preferences = {}) {
    try {
      const items = await this.searchItems({ itemType: searchTerm, ...preferences });
      
      // If there's a search term, score by relevance
      if (searchTerm) {
        const scored = items.map(item => {
          let score = 0;
          
          const itemLower = item.item.toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          // Exact match
          if (itemLower === searchLower) {
            score += 20;
          }
          // Starts with search term
          else if (itemLower.startsWith(searchLower)) {
            score += 15;
          }
          // Contains search term
          else if (itemLower.includes(searchLower)) {
            score += 10;
          }
          
          // Condition bonus
          if (item.condition === 'like new') {
            score += 5;
          } else if (item.condition === 'good') {
            score += 3;
          }
          
          // Status preference (donate > exchange > sell)
          if (preferences.preferFree) {
            if (item.status === 'donate') {
              score += 10;
            } else if (item.status === 'exchange') {
              score += 5;
            }
          }
          
          return { ...item, score };
        });
        
        return scored
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);
      }
      
      return items;
    } catch (error) {
      console.error('Error getting exchange recommendations:', error);
      throw error;
    }
  }

  /**
   * Get nearby items (based on block proximity)
   */
  async getNearbyItems(userBlock, radius = 3) {
    try {
      return await convexClient.query(api.exchange.getNearbyItems, {
        userBlock,
        radius,
      });
    } catch (error) {
      console.error('Error getting nearby items:', error);
      throw error;
    }
  }

  /**
   * Get claims for an item
   */
  async getItemClaims(itemId) {
    try {
      return await convexClient.query(api.exchange.getItemClaims, { itemId });
    } catch (error) {
      console.error('Error getting item claims:', error);
      throw error;
    }
  }
}

export const exchangeModel = new ExchangeModel();
export default exchangeModel;
