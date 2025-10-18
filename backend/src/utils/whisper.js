import OpenAI from 'openai';
import { config } from '../config/database.js';

/**
 * OpenAI Whisper Service for Speech-to-Text only
 * (Keeping this separate as Gemini doesn't have STT)
 */
export class WhisperService {
  constructor() {
    // Only initialize if API key is provided
    if (config.openai.apiKey) {
      this.client = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    } else {
      console.warn('⚠️  OpenAI API key not provided. Speech-to-text will not be available.');
    }
  }

  /**
   * Transcribe audio to text (Speech-to-Text)
   */
  async transcribe(audioFile, options = {}) {
    if (!this.client) {
      throw new Error('Whisper service not configured. Please add OPENAI_API_KEY to use speech-to-text.');
    }

    try {
      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: options.model || 'whisper-1',
        language: options.language || 'en',
        response_format: options.responseFormat || 'json',
        temperature: options.temperature || 0,
      });

      return response.text;
    } catch (error) {
      console.error('Whisper Transcription Error:', error.message);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return !!this.client;
  }
}

// Export singleton instance
export const whisperService = new WhisperService();

export default whisperService;

