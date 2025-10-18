import { aiAgentService } from '../services/aiAgentService.js';
import { userModel } from '../models/userModel.js';

export class AIController {
  /**
   * Chat with AI Mom
   */
  async chat(req, res) {
    try {
      const userId = req.user?.id || 'guest';
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Message is required',
        });
      }

      // Process the message
      const response = await aiAgentService.processMessage(userId, message, context);

      res.json({
        success: true,
        data: {
          userMessage: message,
          intent: response.intent,
          emotion: response.emotion,
          response: response.response,
          recommendations: response.data,
          needsFollowUp: response.needsFollowUp,
          confidence: response.confidence,
        },
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process message',
      });
    }
  }

  /**
   * Analyze user intent
   */
  async analyzeIntent(req, res) {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Message is required',
        });
      }

      const intent = await aiAgentService.analyzeIntent(message, context);

      res.json({
        success: true,
        data: intent,
      });
    } catch (error) {
      console.error('Analyze intent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze intent',
      });
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const { limit } = req.query;
      const history = await userModel.getInteractionHistory(
        userId,
        limit ? parseInt(limit) : 50
      );

      res.json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      console.error('Get conversation history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversation history',
      });
    }
  }

  /**
   * Get user preferences for AI personalization
   */
  async getUserPreferences(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const preferences = await userModel.getPreferences(userId);

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      console.error('Get user preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user preferences',
      });
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const preferences = req.body;
      const updatedPreferences = await userModel.updatePreferences(userId, preferences);

      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Preferences updated successfully',
      });
    } catch (error) {
      console.error('Update user preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update preferences',
      });
    }
  }

  /**
   * Get user stats
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const stats = await userModel.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user stats',
      });
    }
  }

  /**
   * Update Mom Points
   */
  async updateMomPoints(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const { points, reason } = req.body;

      if (!points || !reason) {
        return res.status(400).json({
          success: false,
          error: 'Points and reason are required',
        });
      }

      const result = await userModel.updateMomPoints(userId, points, reason);

      res.json({
        success: true,
        data: result,
        message: 'Mom Points updated successfully',
      });
    } catch (error) {
      console.error('Update Mom Points error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update Mom Points',
      });
    }
  }

  /**
   * Get Mom Points history
   */
  async getMomPointsHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }

      const { limit } = req.query;
      const history = await userModel.getMomPointsHistory(
        userId,
        limit ? parseInt(limit) : 50
      );

      res.json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      console.error('Get Mom Points history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Mom Points history',
      });
    }
  }
}

export const aiController = new AIController();
export default aiController;

