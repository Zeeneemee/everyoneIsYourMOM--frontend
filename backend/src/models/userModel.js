import { convexClient } from '../utils/convexClient.js';
import { api } from '../../convex/_generated/api.js';

export class UserModel {
  /**
   * Get all users
   */
  async getAll() {
    try {
      // Convex doesn't have a getAll by default, so we'd need to add it if needed
      return [];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getById(userId) {
    try {
      return await convexClient.query(api.users.getById, { id: userId });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getByEmail(email) {
    try {
      return await convexClient.query(api.users.getByEmail, { email });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(data) {
    try {
      return await convexClient.mutation(api.users.create, data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(userId, data) {
    try {
      return await convexClient.mutation(api.users.update, { id: userId, data });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Get user with preferences
   */
  async getUserWithPreferences(userId) {
    try {
      const user = await this.getById(userId);
      if (!user) return null;

      const preferences = await this.getPreferences(userId);

      return {
        ...user,
        preferences,
      };
    } catch (error) {
      console.error('Error getting user with preferences:', error);
      throw error;
    }
  }

  /**
   * Get or create user preferences
   */
  async getPreferences(userId) {
    try {
      return await convexClient.query(api.users.getPreferences, { userId });
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId, preferences) {
    try {
      return await convexClient.mutation(api.users.updatePreferences, {
        userId,
        ...preferences,
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Get user's interaction history
   */
  async getInteractionHistory(userId, limit = 50) {
    try {
      return await convexClient.query(api.users.getInteractionHistory, {
        userId,
        limit,
      });
    } catch (error) {
      console.error('Error getting interaction history:', error);
      throw error;
    }
  }

  /**
   * Log user interaction (for AI learning)
   */
  async logInteraction(userId, interactionData) {
    try {
      return await convexClient.mutation(api.users.logInteraction, {
        userId,
        ...interactionData,
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
      throw error;
    }
  }

  /**
   * Update Mom Points (gamification)
   */
  async updateMomPoints(userId, points, reason) {
    try {
      return await convexClient.mutation(api.users.updateMomPoints, {
        userId,
        points,
        reason,
      });
    } catch (error) {
      console.error('Error updating Mom Points:', error);
      throw error;
    }
  }

  /**
   * Get Mom Points history
   */
  async getMomPointsHistory(userId, limit = 50) {
    try {
      return await convexClient.query(api.users.getMomPointsHistory, {
        userId,
        limit,
      });
    } catch (error) {
      console.error('Error getting Mom Points history:', error);
      throw error;
    }
  }

  /**
   * Get user stats and analytics
   */
  async getUserStats(userId) {
    try {
      const [interactions, user] = await Promise.all([
        this.getInteractionHistory(userId, 100),
        this.getById(userId),
      ]);

      return {
        totalInteractions: interactions.length,
        lastActive: interactions[0]?._creationTime || null,
        momPoints: user?.momPoints || 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}

export const userModel = new UserModel();
export default userModel;
