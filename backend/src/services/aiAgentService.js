import { geminiService } from '../utils/gemini.js';
import { foodModel } from '../models/foodModel.js';
import { cleaningModel } from '../models/cleaningModel.js';
import { exchangeModel } from '../models/exchangeModel.js';
import { userModel } from '../models/userModel.js';
import { mem0Service } from './mem0Service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AI Agent Service for "Mom" character
 * Handles natural language processing and intent recognition
 */
export class AIAgentService {
  constructor() {
    // Load speech templates and persona from data.json
    this.loadPersonaData();
  }

  loadPersonaData() {
    try {
      const dataPath = path.join(__dirname, '../../../public/data.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      this.personaData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading persona data:', error);
      this.personaData = { metadata: {}, speech_templates: {}, scolding_rules: [] };
    }
  }

  /**
   * Process user message and generate response
   */
  async processMessage(userId, userMessage, context = {}) {
    try {
      // Get user preferences
      const userPrefs = await userModel.getPreferences(userId);
      
      // Retrieve relevant memories from Mem0
      const memories = await mem0Service.retrieveMemories(userId, userMessage, 5);
      const memoryContext = memories.map(m => m.memory || m.text || JSON.stringify(m)).join('\n');
      
      // Analyze intent
      const intent = await geminiService.analyzeIntent(userMessage, {
        userPreferences: userPrefs,
        userMemories: memoryContext,
        ...context,
      });

      // Log the interaction
      await userModel.logInteraction(userId, {
        interactionType: 'text',
        intent: intent.intent,
        userMessage,
        emotion: intent.emotion,
        metadata: { intent, context },
      });

      // Fetch relevant data based on intent
      let data = null;
      let response = null;

      switch (intent.intent) {
        case 'food':
          data = await this.handleFoodIntent(intent, userPrefs);
          response = await this.generateFoodResponse(userMessage, intent, data, memoryContext);
          break;

        case 'cleaning':
          data = await this.handleCleaningIntent(intent, userPrefs);
          response = await this.generateCleaningResponse(userMessage, intent, data, memoryContext);
          break;

        case 'exchange':
          data = await this.handleExchangeIntent(intent, userPrefs);
          response = await this.generateExchangeResponse(userMessage, intent, data, memoryContext);
          break;

        case 'general':
        default:
          response = await this.generateGeneralResponse(userMessage, intent, memoryContext);
          break;
      }

      // Update interaction log with AI response
      await userModel.logInteraction(userId, {
        interactionType: 'text',
        intent: intent.intent,
        userMessage,
        aiResponse: response.text,
        emotion: intent.emotion,
        successful: true,
      });

      // Store interaction as memory in Mem0
      await mem0Service.storeMemory(userId, {
        user: userMessage,
        assistant: response.text,
      }, {
        intent: intent.intent,
        emotion: intent.emotion,
        timestamp: new Date().toISOString(),
        type: 'text_chat',
      });

      return {
        intent: intent.intent,
        emotion: intent.emotion,
        response: response.text,
        data: data,
        needsFollowUp: intent.needsFollowUp,
        confidence: intent.confidence,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Handle food-related intent
   */
  async handleFoodIntent(intent, userPrefs) {
    try {
      const preferences = {
        diet: intent.entities.diet || userPrefs?.dietaryRestrictions || [],
        allergens: intent.entities.allergens || userPrefs?.allergens || [],
        preferredTags: intent.entities.tags || userPrefs?.preferredTags || [],
        maxDistance: userPrefs?.maxDistance || 1.0,
      };

      const recommendations = await foodModel.getRecommendations(null, preferences);
      
      return {
        recommendations: recommendations.slice(0, 3), // Top 3 matches
        preferences,
      };
    } catch (error) {
      console.error('Error handling food intent:', error);
      return { recommendations: [], preferences: {} };
    }
  }

  /**
   * Handle cleaning-related intent
   */
  async handleCleaningIntent(intent, userPrefs) {
    try {
      const preferences = {
        petFriendly: intent.entities.petFriendly ?? userPrefs?.petFriendly ?? false,
        preferredTime: intent.entities.timePreference || userPrefs?.preferredTimeSlots?.[0],
      };

      const recommendations = await cleaningModel.getRecommendations(null, preferences);
      
      return {
        recommendations: recommendations.slice(0, 3),
        preferences,
      };
    } catch (error) {
      console.error('Error handling cleaning intent:', error);
      return { recommendations: [], preferences: {} };
    }
  }

  /**
   * Handle exchange-related intent
   */
  async handleExchangeIntent(intent, userPrefs) {
    try {
      const itemType = intent.entities.itemType || '';
      const preferences = {
        preferFree: intent.entities.priceRange === 'low',
      };

      const recommendations = await exchangeModel.getRecommendations(
        null,
        itemType,
        preferences
      );
      
      return {
        recommendations: recommendations.slice(0, 3),
        searchTerm: itemType,
        preferences,
      };
    } catch (error) {
      console.error('Error handling exchange intent:', error);
      return { recommendations: [], preferences: {} };
    }
  }

  /**
   * Generate food response using templates and AI
   */
  async generateFoodResponse(userMessage, intent, data, memoryContext = '') {
    const { recommendations } = data;

    if (recommendations.length === 0) {
      // No results found
      const template = this.getRandomTemplate('hungry_none');
      return { text: template };
    }

    // Pick the best match
    const topFood = recommendations[0];
    
    // Use template or generate custom response
    const useTemplate = Math.random() > 0.3; // 70% use template
    
    if (useTemplate && this.personaData.speech_templates.hungry_found) {
      const template = this.getRandomTemplate('hungry_found');
      const text = template
        .replace('{{house}}', topFood.house)
        .replace('{{dish}}', topFood.dish);
      return { text };
    }

    // Generate AI response
    const context = {
      intent: 'food',
      topRecommendation: topFood,
      userEmotion: intent.emotion,
      userMemories: memoryContext,
    };

    const aiResponse = await geminiService.generateMomResponse(
      userMessage,
      context,
      { recommendations }
    );

    return { text: aiResponse };
  }

  /**
   * Generate cleaning response
   */
  async generateCleaningResponse(userMessage, intent, data, memoryContext = '') {
    const { recommendations } = data;

    if (recommendations.length === 0) {
      const template = this.getRandomTemplate('cleaning_none');
      return { text: template };
    }

    const topSlot = recommendations[0];
    
    const useTemplate = Math.random() > 0.3;
    
    if (useTemplate && this.personaData.speech_templates.cleaning_found) {
      const template = this.getRandomTemplate('cleaning_found');
      const text = template
        .replace('{{available_cleaner}}', topSlot.availableCleaner)
        .replace('{{time}}', topSlot.time)
        .replace('{{pet_friendly}}', topSlot.petFriendly ? 'yes' : 'no');
      return { text };
    }

    const context = {
      intent: 'cleaning',
      topRecommendation: topSlot,
      userEmotion: intent.emotion,
      userMemories: memoryContext,
    };

    const aiResponse = await geminiService.generateMomResponse(
      userMessage,
      context,
      { recommendations }
    );

    return { text: aiResponse };
  }

  /**
   * Generate exchange response
   */
  async generateExchangeResponse(userMessage, intent, data, memoryContext = '') {
    const { recommendations, searchTerm } = data;

    if (recommendations.length === 0) {
      const template = this.getRandomTemplate('item_none');
      const text = template.replace('{{item}}', searchTerm || 'that');
      return { text };
    }

    const topItem = recommendations[0];
    
    const useTemplate = Math.random() > 0.3;
    
    if (useTemplate && this.personaData.speech_templates.item_found) {
      const template = this.getRandomTemplate('item_found');
      const text = template
        .replace('{{item}}', topItem.item)
        .replace('{{owner_block}}', topItem.ownerBlock)
        .replace('{{status}}', topItem.status);
      return { text };
    }

    const context = {
      intent: 'exchange',
      topRecommendation: topItem,
      userEmotion: intent.emotion,
      userMemories: memoryContext,
    };

    const aiResponse = await geminiService.generateMomResponse(
      userMessage,
      context,
      { recommendations }
    );

    return { text: aiResponse };
  }

  /**
   * Generate general response
   */
  async generateGeneralResponse(userMessage, intent, memoryContext = '') {
    const context = {
      intent: 'general',
      userEmotion: intent.emotion,
      userMemories: memoryContext,
    };

    // Check for special cases (homesick, gratitude, etc.)
    if (intent.emotion === 'homesick' && this.personaData.speech_templates.homesick) {
      const template = this.getRandomTemplate('homesick');
      return { text: template };
    }

    const aiResponse = await geminiService.generateMomResponse(
      userMessage,
      context,
      {}
    );

    return { text: aiResponse };
  }

  /**
   * Get random template from speech templates
   */
  getRandomTemplate(category) {
    const templates = this.personaData.speech_templates[category];
    if (!templates || templates.length === 0) {
      return "Okay lah, I help you check.";
    }
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Check if user should be scolded (playfully)
   */
  shouldScold(userId, context) {
    // Implementation for scolding logic based on scolding_rules
    // This would check user behavior patterns
    return false;
  }
}

export const aiAgentService = new AIAgentService();
export default aiAgentService;

