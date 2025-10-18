import express from 'express';
import { aiController } from '../controllers/aiController.js';

const router = express.Router();

// Chat with AI Mom
router.post('/chat', aiController.chat.bind(aiController));

// Analyze intent
router.post('/analyze-intent', aiController.analyzeIntent.bind(aiController));

// Get conversation history
router.get('/conversations', aiController.getConversationHistory.bind(aiController));

// Get user preferences
router.get('/preferences', aiController.getUserPreferences.bind(aiController));

// Update user preferences
router.put('/preferences', aiController.updateUserPreferences.bind(aiController));

// Get user stats
router.get('/stats', aiController.getUserStats.bind(aiController));

// Update Mom Points
router.post('/mom-points', aiController.updateMomPoints.bind(aiController));

// Get Mom Points history
router.get('/mom-points/history', aiController.getMomPointsHistory.bind(aiController));

export default router;

