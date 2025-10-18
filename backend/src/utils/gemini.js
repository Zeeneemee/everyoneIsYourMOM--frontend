import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/database.js';

/**
 * Google Gemini Service for AI Agent functionality
 */
export class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = config.gemini.model;
    this.temperature = config.gemini.temperature;
    this.maxTokens = config.gemini.maxTokens;
  }

  /**
   * Generate a chat completion
   */
  async chat(messages, options = {}) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: options.model || this.model,
        generationConfig: {
          temperature: options.temperature ?? this.temperature,
          maxOutputTokens: options.maxTokens || this.maxTokens,
          topP: options.topP || 0.95,
          topK: options.topK || 40,
        },
      });

      // Convert OpenAI-style messages to Gemini format
      const geminiMessages = this.convertMessagesToGemini(messages);
      
      // Separate system message if present
      let systemInstruction = '';
      const chatMessages = [];
      
      for (const msg of geminiMessages) {
        if (msg.role === 'system') {
          systemInstruction = msg.content;
        } else {
          chatMessages.push(msg);
        }
      }

      // Create chat with system instruction if available
      const chatConfig = systemInstruction 
        ? { history: chatMessages.slice(0, -1), systemInstruction }
        : { history: chatMessages.slice(0, -1) };

      const chat = model.startChat(chatConfig);
      
      // Get the last user message
      const lastMessage = chatMessages[chatMessages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      
      const response = await result.response;
      const text = response.text();

      return {
        role: 'assistant',
        content: text,
      };
    } catch (error) {
      console.error('Gemini Chat Error:', error.message);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Convert OpenAI-style messages to Gemini format
   */
  convertMessagesToGemini(messages) {
    return messages.map(msg => {
      // Map roles: assistant -> model, user -> user, system -> system
      const role = msg.role === 'assistant' ? 'model' : msg.role;
      return {
        role,
        content: msg.content,
        parts: [{ text: msg.content }],
      };
    });
  }

  /**
   * Analyze user intent and extract entities
   */
  async analyzeIntent(userMessage, context = {}) {
    const systemPrompt = `You are an intelligent assistant that analyzes user requests in a Singaporean condo community app.
Your job is to understand what the user wants and extract relevant information.

Respond ONLY with a JSON object (no markdown, no code blocks) with this structure:
{
  "intent": "food" | "cleaning" | "exchange" | "general",
  "entities": {
    "diet": ["vegetarian", "halal", etc.],
    "allergens": ["seafood", "nuts", etc.],
    "tags": ["spicy", "high protein", etc.],
    "timePreference": "morning|afternoon|evening|specific time",
    "petFriendly": true|false,
    "itemType": "string",
    "priceRange": "low|medium|high",
    "urgency": "low|medium|high"
  },
  "emotion": "hungry" | "stressed" | "homesick" | "neutral" | "grateful",
  "needsFollowUp": true|false,
  "confidence": 0.0-1.0
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.chat(messages, {
        temperature: 0.3,
        maxTokens: 300,
      });

      // Parse JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Intent Analysis Error:', error.message);
      // Return a default response if parsing fails
      return {
        intent: 'general',
        entities: {},
        emotion: 'neutral',
        needsFollowUp: true,
        confidence: 0.5,
      };
    }
  }

  /**
   * Generate a mom-style response
   */
  async generateMomResponse(userMessage, context, data) {
    const memorySection = context.userMemories 
      ? `\nWhat you remember about this user:\n${context.userMemories}\n\nUse this context to personalize your response naturally. Don't explicitly mention "I remember" unless relevant.`
      : '\nNo previous interactions yet. Get to know this user through this conversation.';

    const systemPrompt = `You are a caring, practical Singaporean mom AI assistant helping residents in a condo community.

Your personality:
- Caring but practical and sometimes brutally honest
- Use light Singlish (don't overdo it)
- Short, natural sentences
- Address issues directly but warmly
- Sometimes scold lovingly if user neglects themselves

Speech style:
- Natural conversational tone
- Don't read lists robotically
- Refer to neighbors by name when mentioning their offerings
- Use "lah", "ah", "leh" naturally but sparingly
${memorySection}

Context: ${JSON.stringify(context)}

Available data: ${JSON.stringify(data)}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.chat(messages, {
        temperature: 0.7,
        maxTokens: 200,
      });

      return response.content;
    } catch (error) {
      console.error('Mom Response Generation Error:', error.message);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Generate simple completion (for single prompt)
   */
  async generateContent(prompt, options = {}) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: options.model || this.model,
        generationConfig: {
          temperature: options.temperature ?? this.temperature,
          maxOutputTokens: options.maxTokens || this.maxTokens,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Gemini Generate Content Error:', error.message);
      throw new Error('Failed to generate content');
    }
  }

  /**
   * Create embeddings for semantic search
   * Note: Gemini uses a different embedding model
   */
  async createEmbedding(text, options = {}) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'text-embedding-004' // Gemini's embedding model
      });

      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Gemini Embedding Error:', error.message);
      throw new Error('Failed to create embedding');
    }
  }

  /**
   * Analyze food image and extract nutritional information
   */
  async analyzeFoodImage(imageData, options = {}) {
    const IMAGE_ANALYSIS_INSTRUCTION = `
Analyze the food in this image and provide information in this EXACT English format without any additional text or markdown:
Food Name: [Food Name]
Estimated Weight: [Estimated Weight in grams] g
Calories: [Number of Calories] kcal
Protein: [Amount of Protein] g
Carbohydrates: [Amount of Carbohydrates] g
Fat: [Amount of Fat] g
Main Ingredients: [Main Ingredients]
Health Tips: [Short relevant health tips]
`;

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: options.model || 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: options.temperature ?? 0.3,
          maxOutputTokens: options.maxTokens || 500,
        },
      });

      // Convert image data to the format expected by Gemini
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: options.mimeType || 'image/jpeg'
        }
      };

      const result = await model.generateContent([IMAGE_ANALYSIS_INSTRUCTION, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parse the structured response
      return this.parseFoodAnalysisResponse(text);
    } catch (error) {
      console.error('Food Image Analysis Error:', error.message);
      throw new Error('Failed to analyze food image');
    }
  }

  /**
   * Parse the structured food analysis response
   */
  parseFoodAnalysisResponse(text) {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      const result = {};

      for (const line of lines) {
        if (line.includes('Food Name:')) {
          result.foodName = line.split('Food Name:')[1]?.trim();
        } else if (line.includes('Estimated Weight:')) {
          const weight = line.split('Estimated Weight:')[1]?.trim();
          result.estimatedWeight = weight ? weight.replace('g', '').trim() : null;
        } else if (line.includes('Calories:')) {
          const calories = line.split('Calories:')[1]?.trim();
          result.calories = calories ? calories.replace('kcal', '').trim() : null;
        } else if (line.includes('Protein:')) {
          const protein = line.split('Protein:')[1]?.trim();
          result.protein = protein ? protein.replace('g', '').trim() : null;
        } else if (line.includes('Carbohydrates:')) {
          const carbs = line.split('Carbohydrates:')[1]?.trim();
          result.carbohydrates = carbs ? carbs.replace('g', '').trim() : null;
        } else if (line.includes('Fat:')) {
          const fat = line.split('Fat:')[1]?.trim();
          result.fat = fat ? fat.replace('g', '').trim() : null;
        } else if (line.includes('Main Ingredients:')) {
          result.mainIngredients = line.split('Main Ingredients:')[1]?.trim();
        } else if (line.includes('Health Tips:')) {
          result.healthTips = line.split('Health Tips:')[1]?.trim();
        }
      }

      return result;
    } catch (error) {
      console.error('Food Analysis Parsing Error:', error.message);
      return {
        foodName: 'Unknown',
        estimatedWeight: null,
        calories: null,
        protein: null,
        carbohydrates: null,
        fat: null,
        mainIngredients: 'Unable to identify',
        healthTips: 'Please consult a nutritionist for accurate information'
      };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

export default geminiService;

