import { mem0Service } from '../services/mem0Service.js';

/**
 * Memory Controller
 * Handles memory management API endpoints for user memory data
 */
export class MemoryController {
  /**
   * Get all memories for the authenticated user
   */
  async getUserMemories(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const memories = await mem0Service.getAllUserMemories(userId);

      res.json({
        success: true,
        data: memories,
        count: memories.length,
      });
    } catch (error) {
      console.error('Get user memories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch memories',
      });
    }
  }

  /**
   * Search user memories with a query
   */
  async searchMemories(req, res) {
    try {
      const userId = req.user?.id;
      const { q: query, limit } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      const memories = await mem0Service.searchMemories(
        userId,
        query,
        { limit: limit ? parseInt(limit) : 10 }
      );

      res.json({
        success: true,
        data: memories,
        count: memories.length,
        query,
      });
    } catch (error) {
      console.error('Search memories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search memories',
      });
    }
  }

  /**
   * Delete a specific memory
   */
  async deleteMemory(req, res) {
    try {
      const userId = req.user?.id;
      const { id: memoryId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      if (!memoryId) {
        return res.status(400).json({
          success: false,
          error: 'Memory ID is required',
        });
      }

      const result = await mem0Service.deleteMemory(userId, memoryId);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.message,
        });
      }
    } catch (error) {
      console.error('Delete memory error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete memory',
      });
    }
  }

  /**
   * Clear all memories for the authenticated user
   */
  async clearAllMemories(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const result = await mem0Service.clearAllMemories(userId);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          count: result.count,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.message,
        });
      }
    } catch (error) {
      console.error('Clear all memories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear memories',
      });
    }
  }

  /**
   * Get memory statistics for the authenticated user
   */
  async getMemoryStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const stats = await mem0Service.getMemoryStats(userId);

      if (stats) {
        res.json({
          success: true,
          data: stats,
        });
      } else {
        res.json({
          success: true,
          data: {
            total: 0,
            byType: {},
            byIntent: {},
          },
        });
      }
    } catch (error) {
      console.error('Get memory stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch memory statistics',
      });
    }
  }
}

export const memoryController = new MemoryController();
export default memoryController;

