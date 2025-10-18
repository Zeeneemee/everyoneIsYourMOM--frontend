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
}

// Export singleton instance
export const geminiService = new GeminiService();

export default geminiService;

