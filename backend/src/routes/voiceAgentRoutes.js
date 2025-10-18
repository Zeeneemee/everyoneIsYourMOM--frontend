import express from 'express';
import { voiceAgentController } from '../controllers/voiceAgentController.js';

const router = express.Router();

/**
 * Voice Agent Routes
 * Custom tool endpoints for ElevenLabs Conversational AI
 */

// Search food items
router.post('/search-food', voiceAgentController.searchFood.bind(voiceAgentController));

// Get personalized food recommendations
router.post('/personalized-food', voiceAgentController.getPersonalizedFood.bind(voiceAgentController));

// Search cleaning slots
router.post('/search-cleaning', voiceAgentController.searchCleaningSlots.bind(voiceAgentController));

// Search exchange items
router.post('/search-exchange', voiceAgentController.searchExchangeItems.bind(voiceAgentController));

// Book a cleaning slot
router.post('/book-cleaning', voiceAgentController.bookCleaningSlot.bind(voiceAgentController));

// Claim an exchange item
router.post('/claim-item', voiceAgentController.claimExchangeItem.bind(voiceAgentController));

// Navigate to a screen
router.post('/navigate', voiceAgentController.navigate.bind(voiceAgentController));

// Parse food mentions from text (for real-time speech parsing)
router.post('/parse-food-mentions', voiceAgentController.parseFoodMentions.bind(voiceAgentController));

export default router;

