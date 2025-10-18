import { exchangeModel } from '../models/exchangeModel.js';

export class ExchangeController {
  /**
   * Get all exchange items
   */
  async getAllItems(req, res) {
    try {
      const { available, status } = req.query;
      const filters = {};
      
      if (available !== undefined) {
        filters.available = available === 'true';
      }
      if (status) {
        filters.status = status;
      }
      
      const items = await exchangeModel.getAll(filters);
      
      res.json({
        success: true,
        data: items,
        count: items.length,
      });
    } catch (error) {
      console.error('Get all items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exchange items',
      });
    }
  }

  /**
   * Get item by ID
   */
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await exchangeModel.getById(id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found',
        });
      }
      
      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error('Get item by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch item',
      });
    }
  }

  /**
   * Search exchange items
   */
  async searchItems(req, res) {
    try {
      const { status, condition, itemType, ownerBlock } = req.query;
      
      const criteria = {
        status,
        condition,
        itemType,
        ownerBlock,
      };
      
      const results = await exchangeModel.searchItems(criteria);
      
      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      console.error('Search items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search items',
      });
    }
  }

  /**
   * Get item recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { searchTerm, preferFree } = req.query;
      
      const preferences = {
        preferFree: preferFree === 'true',
      };
      
      const recommendations = await exchangeModel.getRecommendations(
        userId,
        searchTerm || '',
        preferences
      );
      
      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
      });
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations',
      });
    }
  }

  /**
   * Get nearby items
   */
  async getNearbyItems(req, res) {
    try {
      const { block, radius } = req.query;
      
      if (!block) {
        return res.status(400).json({
          success: false,
          error: 'Block parameter is required',
        });
      }
      
      const items = await exchangeModel.getNearbyItems(
        block,
        radius ? parseInt(radius) : 3
      );
      
      res.json({
        success: true,
        data: items,
        count: items.length,
      });
    } catch (error) {
      console.error('Get nearby items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get nearby items',
      });
    }
  }

  /**
   * Post new item
   */
  async postItem(req, res) {
    try {
      const userId = req.user?.id;
      const itemData = req.body;
      
      if (!itemData.item || !itemData.status || !itemData.ownerBlock) {
        return res.status(400).json({
          success: false,
          error: 'Item name, status, and owner block are required',
        });
      }
      
      const newItem = await exchangeModel.postItem(userId, itemData);
      
      res.status(201).json({
        success: true,
        data: newItem,
        message: 'Item posted successfully',
      });
    } catch (error) {
      console.error('Post item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to post item',
      });
    }
  }

  /**
   * Update item
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedItem = await exchangeModel.update(id, updates);
      
      res.json({
        success: true,
        data: updatedItem,
        message: 'Item updated successfully',
      });
    } catch (error) {
      console.error('Update item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update item',
      });
    }
  }

  /**
   * Delete item
   */
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      
      await exchangeModel.delete(id);
      
      res.json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Delete item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete item',
      });
    }
  }

  /**
   * Claim an item
   */
  async claimItem(req, res) {
    try {
      const userId = req.user?.id;
      const { itemId, message } = req.body;
      
      if (!itemId) {
        return res.status(400).json({
          success: false,
          error: 'Item ID is required',
        });
      }
      
      const claim = await exchangeModel.claimItem(itemId, userId, message);
      
      res.status(201).json({
        success: true,
        data: claim,
        message: 'Item claimed successfully',
      });
    } catch (error) {
      console.error('Claim item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to claim item',
      });
    }
  }

  /**
   * Get user's posted items
   */
  async getUserItems(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }
      
      const items = await exchangeModel.getUserItems(userId);
      
      res.json({
        success: true,
        data: items,
        count: items.length,
      });
    } catch (error) {
      console.error('Get user items error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user items',
      });
    }
  }

  /**
   * Get claims for an item
   */
  async getItemClaims(req, res) {
    try {
      const { id } = req.params;
      
      const claims = await exchangeModel.getItemClaims(id);
      
      res.json({
        success: true,
        data: claims,
        count: claims.length,
      });
    } catch (error) {
      console.error('Get item claims error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch item claims',
      });
    }
  }
}

export const exchangeController = new ExchangeController();
export default exchangeController;

