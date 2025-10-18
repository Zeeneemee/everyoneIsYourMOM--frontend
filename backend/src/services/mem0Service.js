import { MemoryClient } from 'mem0ai';
import { config } from '../config/database.js';

/**
 * Mem0 Service for learning and storing user preferences
 * Enables Mom to remember user interactions and personalize responses
 */
export class Mem0Service {
  constructor() {
    this.client = null;
    this.enabled = false;
    this.initializeClient();
  }

  /**
   * Initialize Mem0 client
   */
  initializeClient() {
    try {
      if (!config.mem0.apiKey) {
        console.warn('⚠️  Mem0 service disabled: No API key provided');
        return;
      }

      this.client = new MemoryClient(config.mem0.apiKey);
      this.enabled = true;
      console.log('✅ Mem0 memory service initialized');
    } catch (error) {
      console.error('Failed to initialize Mem0:', error.message);
      this.enabled = false;
    }
  }

  /**
   * Get prefixed user ID for namespace isolation
   */
  getUserId(userId) {
    return `${config.mem0.userIdPrefix}${userId}`;
  }

  /**
   * Store a new memory for a user
   * @param {string} userId - User ID
   * @param {object|string} message - Message content (can be string or object with user/assistant keys)
   * @param {object} metadata - Additional metadata (intent, emotion, timestamp, type)
   */
  async storeMemory(userId, message, metadata = {}) {
    if (!this.enabled) {
      console.log('Mem0 disabled, skipping memory storage');
      return null;
    }

    try {
      const prefixedUserId = this.getUserId(userId);
      
      // Format message for Mem0
      let messageContent;
      if (typeof message === 'string') {
        messageContent = message;
      } else if (message.user && message.assistant) {
        // Conversation format
        messageContent = `User: ${message.user}\nAssistant: ${message.assistant}`;
      } else if (message.action) {
        // Action format (for voice interactions)
        messageContent = `Action: ${message.action}\nParameters: ${JSON.stringify(message.parameters)}\nResult: ${JSON.stringify(message.result)}`;
      } else {
        messageContent = JSON.stringify(message);
      }

      // Add memory with metadata
      const result = await this.client.add(messageContent, {
        user_id: prefixedUserId,
        metadata: {
          ...metadata,
          stored_at: new Date().toISOString(),
        },
      });

      console.log(`💾 Memory stored for user ${userId}:`, result);
      return result;
    } catch (error) {
      console.error('Error storing memory:', error.message);
      return null;
    }
  }

  /**
   * Retrieve relevant memories for a user based on query
   * @param {string} userId - User ID
   * @param {string} query - Search query (e.g., current user message)
   * @param {number} limit - Maximum number of memories to retrieve
   */
  async retrieveMemories(userId, query, limit = 5) {
    if (!this.enabled) {
      return [];
    }

    try {
      const prefixedUserId = this.getUserId(userId);

      const result = await this.client.search(query, {
        user_id: prefixedUserId,
        limit: limit,
      });

      console.log(`🔍 Retrieved ${result?.length || 0} memories for user ${userId}`);
      return result || [];
    } catch (error) {
      console.error('Error retrieving memories:', error.message);
      return [];
    }
  }

  /**
   * Get all memories for a user
   * @param {string} userId - User ID
   */
  async getAllUserMemories(userId) {
    if (!this.enabled) {
      return [];
    }

    try {
      const prefixedUserId = this.getUserId(userId);

      const result = await this.client.getAll({
        user_id: prefixedUserId,
      });

      console.log(`📚 Retrieved all memories for user ${userId}: ${result?.length || 0} total`);
      return result || [];
    } catch (error) {
      console.error('Error getting all memories:', error.message);
      return [];
    }
  }

  /**
   * Search memories with a specific query
   * @param {string} userId - User ID
   * @param {string} query - Search query
   * @param {object} filters - Additional filters (e.g., metadata filters)
   */
  async searchMemories(userId, query, filters = {}) {
    if (!this.enabled) {
      return [];
    }

    try {
      const prefixedUserId = this.getUserId(userId);

      const result = await this.client.search(query, {
        user_id: prefixedUserId,
        ...filters,
      });

      return result || [];
    } catch (error) {
      console.error('Error searching memories:', error.message);
      return [];
    }
  }

  /**
   * Delete a specific memory
   * @param {string} userId - User ID
   * @param {string} memoryId - Memory ID to delete
   */
  async deleteMemory(userId, memoryId) {
    if (!this.enabled) {
      return { success: false, message: 'Mem0 disabled' };
    }

    try {
      const prefixedUserId = this.getUserId(userId);

      await this.client.delete(memoryId, {
        user_id: prefixedUserId,
      });

      console.log(`🗑️  Deleted memory ${memoryId} for user ${userId}`);
      return { success: true, message: 'Memory deleted successfully' };
    } catch (error) {
      console.error('Error deleting memory:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Clear all memories for a user
   * @param {string} userId - User ID
   */
  async clearAllMemories(userId) {
    if (!this.enabled) {
      return { success: false, message: 'Mem0 disabled' };
    }

    try {
      const prefixedUserId = this.getUserId(userId);

      // Get all memories first
      const memories = await this.getAllUserMemories(userId);

      // Delete each memory
      for (const memory of memories) {
        await this.client.delete(memory.id, {
          user_id: prefixedUserId,
        });
      }

      console.log(`🗑️  Cleared all memories for user ${userId}: ${memories.length} deleted`);
      return { 
        success: true, 
        message: `Cleared ${memories.length} memories`,
        count: memories.length 
      };
    } catch (error) {
      console.error('Error clearing memories:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get memory statistics for a user
   * @param {string} userId - User ID
   */
  async getMemoryStats(userId) {
    if (!this.enabled) {
      return null;
    }

    try {
      const memories = await this.getAllUserMemories(userId);

      // Analyze memory types
      const stats = {
        total: memories.length,
        byType: {},
        byIntent: {},
        oldestMemory: null,
        newestMemory: null,
      };

      memories.forEach(memory => {
        const metadata = memory.metadata || {};
        
        // Count by type
        const type = metadata.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;

        // Count by intent
        const intent = metadata.intent || 'unknown';
        stats.byIntent[intent] = (stats.byIntent[intent] || 0) + 1;

        // Track oldest and newest
        const timestamp = metadata.stored_at;
        if (timestamp) {
          if (!stats.oldestMemory || timestamp < stats.oldestMemory) {
            stats.oldestMemory = timestamp;
          }
          if (!stats.newestMemory || timestamp > stats.newestMemory) {
            stats.newestMemory = timestamp;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting memory stats:', error.message);
      return null;
    }
  }
}

// Export singleton instance
export const mem0Service = new Mem0Service();
export default mem0Service;

