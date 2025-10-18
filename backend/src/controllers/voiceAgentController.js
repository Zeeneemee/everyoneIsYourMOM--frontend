import { convexClient } from '../utils/convexClient.js';
import { mem0Service } from '../services/mem0Service.js';

/**
 * Voice Agent Controller
 * Handles ElevenLabs Conversational AI custom tool requests
 */
export class VoiceAgentController {
  /**
   * Search for food items based on preferences
   */
  async searchFood(req, res) {
    try {
      const { diet, maxPrice, searchTerm, excludeAllergens, tags, maxEta } = req.body;
      const userId = req.user?.id || req.body.userId;

      console.log('Voice Agent - Food Search:', req.body);

      // Retrieve relevant memories for personalization
      let memories = [];
      if (userId) {
        memories = await mem0Service.retrieveMemories(userId, 
          `food preferences: ${searchTerm || ''} ${diet?.join(' ') || ''}`, 3);
      }

      // Build search parameters
      const searchParams = {};

      if (diet && diet.length > 0) {
        searchParams.diet = diet;
      }

      if (excludeAllergens && excludeAllergens.length > 0) {
        searchParams.excludeAllergens = excludeAllergens;
      }

      if (tags && tags.length > 0) {
        searchParams.tags = tags;
      }

      if (maxPrice) {
        searchParams.maxPrice = maxPrice;
      }

      if (maxEta) {
        searchParams.maxEta = maxEta;
      }

      // Query Convex
      let results;
      if (Object.keys(searchParams).length > 0) {
        results = await convexClient.query('foods:searchByDiet', searchParams);
      } else if (searchTerm) {
        results = await convexClient.query('foods:searchByName', { searchTerm });
      } else {
        results = await convexClient.query('foods:getAll', { available: true });
      }

      // Limit to top 5 results
      const topResults = results.slice(0, 5);

      // Format for agent response
      const formattedResults = topResults.map((food) => ({
        id: food._id,
        name: food.dish,
        house: food.house,
        price: food.price,
        eta: food.eta || 'N/A',
        distance: food.distance || 'N/A',
        rating: food.rating || 5.0,
        diet: food.diet.join(', '),
        tags: food.tags.join(', '),
      }));

      // Store interaction as memory
      if (userId) {
        await mem0Service.storeMemory(userId, {
          action: 'search_food',
          parameters: req.body,
          result: formattedResults,
        }, {
          type: 'voice_interaction',
          intent: 'food',
          timestamp: new Date().toISOString(),
        });
      }

      const response = {
        success: true,
        count: formattedResults.length,
        items: formattedResults,
        message:
          formattedResults.length > 0
            ? `Found ${formattedResults.length} food items.`
            : 'No food items found matching your criteria.',
      };
      
      console.log('Voice Agent - Search Food Results:', response);
      res.json(response);
    } catch (error) {
      console.error('Voice Agent - Food Search Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search food items',
        message: 'Sorry, I had trouble searching for food. Please try again.',
      });
    }
  }

  /**
   * Search for cleaning slots
   */
  async searchCleaningSlots(req, res) {
    try {
      const { petFriendly, timeWindow, maxPrice, cleaner } = req.body;
      const userId = req.user?.id || req.body.userId;

      console.log('Voice Agent - Cleaning Search:', req.body);

      // Retrieve relevant memories for personalization
      let memories = [];
      if (userId) {
        memories = await mem0Service.retrieveMemories(userId, 
          `cleaning preferences: ${timeWindow || ''} pet-friendly: ${petFriendly}`, 3);
      }

      // Build search parameters
      const searchParams = {};

      if (petFriendly !== undefined) {
        searchParams.petFriendly = petFriendly;
      }

      if (timeWindow) {
        searchParams.timeWindow = timeWindow;
      }

      if (maxPrice) {
        searchParams.maxPrice = maxPrice;
      }

      if (cleaner) {
        searchParams.cleaner = cleaner;
      }

      // Query Convex
      let results;
      if (Object.keys(searchParams).length > 0) {
        results = await convexClient.query('cleaning:searchSlots', searchParams);
      } else {
        results = await convexClient.query('cleaning:getAllSlots', { available: true });
      }

      // Limit to top 5 results
      const topResults = results.slice(0, 5);

      // Format for agent response
      const formattedResults = topResults.map((slot) => ({
        id: slot._id,
        cleaner: slot.availableCleaner,
        time: slot.time,
        date: slot.date || 'Today',
        price: slot.price,
        petFriendly: slot.petFriendly ? 'Yes' : 'No',
        duration: slot.duration || 2,
      }));

      // Store interaction as memory
      if (userId) {
        await mem0Service.storeMemory(userId, {
          action: 'search_cleaning',
          parameters: req.body,
          result: formattedResults,
        }, {
          type: 'voice_interaction',
          intent: 'cleaning',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        count: formattedResults.length,
        items: formattedResults,
        message:
          formattedResults.length > 0
            ? `Found ${formattedResults.length} available cleaning slots.`
            : 'No cleaning slots available matching your criteria.',
      });
    } catch (error) {
      console.error('Voice Agent - Cleaning Search Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search cleaning slots',
        message: 'Sorry, I had trouble finding cleaning slots. Please try again.',
      });
    }
  }

  /**
   * Search for exchange items
   */
  async searchExchangeItems(req, res) {
    try {
      const { status, condition, itemType, ownerBlock } = req.body;
      const userId = req.user?.id || req.body.userId;

      console.log('Voice Agent - Exchange Search:', req.body);

      // Retrieve relevant memories for personalization
      let memories = [];
      if (userId) {
        memories = await mem0Service.retrieveMemories(userId, 
          `exchange item preferences: ${itemType || ''}`, 3);
      }

      // Build search parameters
      const searchParams = {};

      if (status) {
        searchParams.status = status;
      }

      if (condition) {
        searchParams.condition = condition;
      }

      if (itemType) {
        searchParams.itemType = itemType;
      }

      if (ownerBlock) {
        searchParams.ownerBlock = ownerBlock;
      }

      // Query Convex
      let results;
      if (Object.keys(searchParams).length > 0) {
        results = await convexClient.query('exchange:searchItems', searchParams);
      } else {
        results = await convexClient.query('exchange:getAll', { available: true });
      }

      // Limit to top 5 results
      const topResults = results.slice(0, 5);

      // Format for agent response
      const formattedResults = topResults.map((item) => ({
        id: item._id,
        name: item.item,
        ownerBlock: item.ownerBlock,
        status: item.status,
        condition: item.condition,
        price: item.price || 'Free',
        category: item.category || 'General',
      }));

      // Store interaction as memory
      if (userId) {
        await mem0Service.storeMemory(userId, {
          action: 'search_exchange',
          parameters: req.body,
          result: formattedResults,
        }, {
          type: 'voice_interaction',
          intent: 'exchange',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        count: formattedResults.length,
        items: formattedResults,
        message:
          formattedResults.length > 0
            ? `Found ${formattedResults.length} items available for exchange.`
            : 'No items found matching your criteria.',
      });
    } catch (error) {
      console.error('Voice Agent - Exchange Search Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search exchange items',
        message: 'Sorry, I had trouble finding items. Please try again.',
      });
    }
  }

  /**
   * Book a cleaning slot
   */
  async bookCleaningSlot(req, res) {
    try {
      const { slotId, userId, specialRequests, address, contactNumber } = req.body;

      console.log('Voice Agent - Book Cleaning:', req.body);

      if (!slotId) {
        return res.status(400).json({
          success: false,
          error: 'Slot ID is required',
          message: 'Please specify which cleaning slot you want to book.',
        });
      }

      // Use a default user ID if not provided (for demo purposes)
      const effectiveUserId = userId || 'guest_user';

      // Book the slot via Convex
      const booking = await convexClient.mutation('cleaning:bookSlot', {
        slotId,
        userId: effectiveUserId,
        specialRequests: specialRequests || '',
        address: address || '',
        contactNumber: contactNumber || '',
      });

      // Store booking action as memory
      if (effectiveUserId && effectiveUserId !== 'guest_user') {
        await mem0Service.storeMemory(effectiveUserId, {
          action: 'book_cleaning',
          slotId,
          specialRequests,
        }, {
          type: 'voice_interaction',
          intent: 'cleaning',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        booking: {
          id: booking._id,
          status: booking.status,
        },
        message: 'Successfully booked the cleaning slot! The cleaner will contact you soon.',
      });
    } catch (error) {
      console.error('Voice Agent - Book Cleaning Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to book cleaning slot',
        message:
          error.message === 'Cleaning slot is not available'
            ? 'Sorry, that cleaning slot is no longer available.'
            : 'Sorry, I had trouble booking the slot. Please try again.',
      });
    }
  }

  /**
   * Claim an exchange item
   */
  async claimExchangeItem(req, res) {
    try {
      const { itemId, userId, message } = req.body;

      console.log('Voice Agent - Claim Item:', req.body);

      if (!itemId) {
        return res.status(400).json({
          success: false,
          error: 'Item ID is required',
          message: 'Please specify which item you want to claim.',
        });
      }

      // Use a default user ID if not provided (for demo purposes)
      const effectiveUserId = userId || 'guest_user';

      // Claim the item via Convex
      const claim = await convexClient.mutation('exchange:claimItem', {
        itemId,
        claimedBy: effectiveUserId,
        message: message || '',
      });

      // Store claim action as memory
      if (effectiveUserId && effectiveUserId !== 'guest_user') {
        await mem0Service.storeMemory(effectiveUserId, {
          action: 'claim_item',
          itemId,
          message,
        }, {
          type: 'voice_interaction',
          intent: 'exchange',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        claim: {
          id: claim._id,
          status: claim.status,
        },
        message:
          'Successfully claimed the item! The owner will be notified and will contact you soon.',
      });
    } catch (error) {
      console.error('Voice Agent - Claim Item Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to claim item',
        message: 'Sorry, I had trouble claiming the item. Please try again.',
      });
    }
  }

  /**
   * Get personalized food recommendations for user
   */
  async getPersonalizedFood(req, res) {
    try {
      const { userId, limit } = req.body;

      console.log('Voice Agent - Personalized Food:', req.body);

      const maxResults = limit || 3;

      // Query Convex for available food
      const allFoods = await convexClient.query('foods:getAll', { available: true });

      if (allFoods.length === 0) {
        return res.json({
          success: true,
          count: 0,
          items: [],
          message: 'No food items available right now.',
        });
      }

      // For now, get top rated items
      // TODO: In future, this can be personalized based on user preferences from database
      const sortedByRating = allFoods
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, maxResults);

      // Format for agent response
      const formattedResults = sortedByRating.map((food) => ({
        id: food._id,
        name: food.dish,
        house: food.house,
        price: food.price,
        eta: food.eta || 'N/A',
        distance: food.distance || 'N/A',
        rating: food.rating || 5.0,
        diet: food.diet.join(', '),
        tags: food.tags.join(', '),
      }));

      const response = {
        success: true,
        count: formattedResults.length,
        items: formattedResults,
        message: `Here are ${formattedResults.length} top-rated food recommendations for you!`,
      };
      
      console.log('Voice Agent - Returning recommendations:', response);
      res.json(response);
    } catch (error) {
      console.error('Voice Agent - Personalized Food Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get personalized recommendations',
        message: 'Sorry, I had trouble finding recommendations for you. Please try again.',
      });
    }
  }

  /**
   * Navigate to a screen in the app
   */
  async navigate(req, res) {
    try {
      const { screen } = req.body;

      console.log('Voice Agent - Navigate:', req.body);

      if (!screen) {
        return res.status(400).json({
          success: false,
          error: 'Screen name is required',
          message: 'Please specify which screen you want to navigate to.',
        });
      }

      // Map screen names to routes
      const screenMap = {
        home: '/home',
        food: '/food',
        cleaning: '/clean',
        clean: '/clean',
        exchange: '/items',
        items: '/items',
        profile: '/profile',
        settings: '/settings',
      };

      const route = screenMap[screen.toLowerCase()] || '/home';

      res.json({
        success: true,
        route,
        screen,
        message: `Navigating to ${screen} screen.`,
      });
    } catch (error) {
      console.error('Voice Agent - Navigate Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to navigate',
        message: 'Sorry, I had trouble navigating. Please try again.',
      });
    }
  }

  /**
   * Parse food mentions from Mom's speech text and return matching items
   */
  async parseFoodMentions(req, res) {
    try {
      const { text, limit } = req.body;
      const userId = req.user?.id || req.body.userId;
      const maxResults = limit || 3;

      console.log('Voice Agent - Parse Food Mentions:', { text, limit });

      if (!text || typeof text !== 'string') {
        return res.json({
          success: false,
          error: 'Text is required',
          items: [],
        });
      }

      // Get all available food items
      const allFoods = await convexClient.query('foods:getAll', { available: true });

      if (allFoods.length === 0) {
        return res.json({
          success: true,
          count: 0,
          items: [],
          message: 'No food items available.',
        });
      }

      // Extract potential food names from text
      // Look for common food dish patterns and match against actual dishes
      const textLower = text.toLowerCase();
      const matchedFoods = [];

      // Check each food item to see if it's mentioned in the text
      for (const food of allFoods) {
        const dishNameLower = food.dish.toLowerCase();
        
        // Direct mention check
        if (textLower.includes(dishNameLower)) {
          matchedFoods.push({
            food,
            score: 10, // High score for exact match
          });
          continue;
        }

        // Check for partial matches (e.g., "chicken" in "Hainanese Chicken Rice")
        const dishWords = dishNameLower.split(' ');
        let matchScore = 0;
        
        for (const word of dishWords) {
          if (word.length > 3 && textLower.includes(word)) {
            matchScore += 2;
          }
        }

        if (matchScore > 0) {
          matchedFoods.push({
            food,
            score: matchScore,
          });
        }
      }

      // If no matches found, return top-rated items
      let finalResults;
      if (matchedFoods.length === 0) {
        console.log('No direct matches found, returning top-rated items');
        finalResults = allFoods
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, maxResults);
      } else {
        // Sort by match score and rating
        finalResults = matchedFoods
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.food.rating || 0) - (a.food.rating || 0);
          })
          .slice(0, maxResults)
          .map(item => item.food);
      }

      // Format results
      const formattedResults = finalResults.map((food) => ({
        id: food._id,
        name: food.dish,
        house: food.house,
        price: food.price,
        eta: food.eta || 'N/A',
        distance: food.distance || 'N/A',
        rating: food.rating || 5.0,
        diet: food.diet.join(', '),
        tags: food.tags.join(', '),
      }));

      console.log('Voice Agent - Matched Foods:', formattedResults);

      // Store interaction as memory
      if (userId && formattedResults.length > 0) {
        await mem0Service.storeMemory(userId, {
          action: 'food_mention_detected',
          text: text.substring(0, 100), // Store truncated text for context
          matched_items: formattedResults.map(f => f.name),
        });
      }

      res.json({
        success: true,
        count: formattedResults.length,
        items: formattedResults,
        message: `Found ${formattedResults.length} matching food items.`,
      });
    } catch (error) {
      console.error('Voice Agent - Parse Food Mentions Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to parse food mentions',
        message: 'Sorry, I had trouble finding food items. Please try again.',
      });
    }
  }
}

export const voiceAgentController = new VoiceAgentController();
export default voiceAgentController;

