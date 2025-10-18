import axios from 'axios';
import { config } from '../config/database.js';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

/**
 * ElevenLabs Service for Text-to-Speech
 */
export class ElevenLabsService {
  constructor() {
    this.apiKey = config.elevenlabs.apiKey;
    this.voiceId = config.elevenlabs.voiceId;
    this.baseURL = ELEVENLABS_API_URL;
  }

  /**
   * Convert text to speech
   * @param {string} text - The text to convert to speech
   * @param {object} options - Optional settings
   * @returns {Promise<Buffer>} - Audio buffer
   */
  async textToSpeech(text, options = {}) {
    try {
      const voiceId = options.voiceId || this.voiceId;
      
      const response = await axios.post(
        `${this.baseURL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: options.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarity_boost || 0.75,
            style: options.style || 0.5,
            use_speaker_boost: options.use_speaker_boost ?? true,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error.response?.data || error.message);
      throw new Error('Failed to convert text to speech');
    }
  }

  /**
   * Get available voices
   */
  async getVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data.voices;
    } catch (error) {
      console.error('ElevenLabs Get Voices Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch voices');
    }
  }

  /**
   * Get voice details
   */
  async getVoiceDetails(voiceId) {
    try {
      const response = await axios.get(`${this.baseURL}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Get Voice Details Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch voice details');
    }
  }

  /**
   * Generate speech with Singaporean mom character style
   */
  async generateMomSpeech(text, emotion = 'neutral') {
    // Adjust voice settings based on emotion
    const emotionSettings = {
      happy: { stability: 0.4, similarity_boost: 0.8, style: 0.6 },
      concerned: { stability: 0.6, similarity_boost: 0.7, style: 0.4 },
      scolding: { stability: 0.7, similarity_boost: 0.75, style: 0.3 },
      caring: { stability: 0.5, similarity_boost: 0.8, style: 0.5 },
      neutral: { stability: 0.5, similarity_boost: 0.75, style: 0.5 },
    };

    const settings = emotionSettings[emotion] || emotionSettings.neutral;

    return await this.textToSpeech(text, settings);
  }

  /**
   * Stream text to speech (for real-time playback)
   */
  async streamTextToSpeech(text, options = {}) {
    try {
      const voiceId = options.voiceId || this.voiceId;
      
      const response = await axios.post(
        `${this.baseURL}/text-to-speech/${voiceId}/stream`,
        {
          text,
          model_id: options.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarity_boost || 0.75,
            style: options.style || 0.5,
            use_speaker_boost: options.use_speaker_boost ?? true,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          responseType: 'stream',
        }
      );

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Stream TTS Error:', error.response?.data || error.message);
      throw new Error('Failed to stream text to speech');
    }
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

export default elevenLabsService;

