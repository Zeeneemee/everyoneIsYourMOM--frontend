import { whisperService } from '../utils/whisper.js';
import { elevenLabsService } from '../utils/elevenlabs.js';
import { aiAgentService } from '../services/aiAgentService.js';
import { userModel } from '../models/userModel.js';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export class VoiceController {
  /**
   * Speech-to-Text: Convert audio to text
   */
  async speechToText(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided',
        });
      }

      // Read the audio file
      const audioFile = fs.createReadStream(req.file.path);

      // Check if Whisper is available
      if (!whisperService.isAvailable()) {
        return res.status(503).json({
          success: false,
          error: 'Speech-to-text service not configured. Please add OPENAI_API_KEY for Whisper.',
        });
      }

      // Transcribe using OpenAI Whisper
      const transcription = await whisperService.transcribe(audioFile, {
        language: 'en',
      });

      // Clean up the uploaded file
      await unlinkAsync(req.file.path);

      res.json({
        success: true,
        data: {
          text: transcription,
        },
      });
    } catch (error) {
      console.error('Speech-to-text error:', error);
      
      // Clean up the file if it exists
      if (req.file?.path) {
        try {
          await unlinkAsync(req.file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to transcribe audio',
      });
    }
  }

  /**
   * Text-to-Speech: Convert text to audio
   */
  async textToSpeech(req, res) {
    try {
      const { text, emotion } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      // Generate speech with mom character style
      const audioBuffer = await elevenLabsService.generateMomSpeech(
        text,
        emotion || 'neutral'
      );

      // Set response headers
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'no-cache',
      });

      res.send(audioBuffer);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate speech',
      });
    }
  }

  /**
   * Stream Text-to-Speech for real-time playback
   */
  async streamTextToSpeech(req, res) {
    try {
      const { text, emotion } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      // Set response headers for streaming
      res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      });

      // Stream the audio
      const audioStream = await elevenLabsService.streamTextToSpeech(text, {
        emotion,
      });

      audioStream.pipe(res);
    } catch (error) {
      console.error('Stream text-to-speech error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to stream speech',
      });
    }
  }

  /**
   * Voice conversation: Complete flow from speech to response
   */
  async voiceConversation(req, res) {
    try {
      const userId = req.user?.id || 'guest';

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided',
        });
      }

      // Check if Whisper is available
      if (!whisperService.isAvailable()) {
        return res.status(503).json({
          success: false,
          error: 'Speech-to-text service not configured. Please add OPENAI_API_KEY for Whisper.',
        });
      }

      // Step 1: Transcribe audio to text
      const audioFile = fs.createReadStream(req.file.path);
      const userMessage = await whisperService.transcribe(audioFile, {
        language: 'en',
      });

      // Step 2: Process message with AI Agent
      const aiResponse = await aiAgentService.processMessage(userId, userMessage);

      // Step 3: Convert AI response to speech
      const audioBuffer = await elevenLabsService.generateMomSpeech(
        aiResponse.response,
        aiResponse.emotion || 'neutral'
      );

      // Clean up the uploaded file
      await unlinkAsync(req.file.path);

      // Step 4: Return both text and audio
      res.json({
        success: true,
        data: {
          userMessage,
          intent: aiResponse.intent,
          emotion: aiResponse.emotion,
          textResponse: aiResponse.response,
          audioResponse: audioBuffer.toString('base64'),
          recommendations: aiResponse.data,
          needsFollowUp: aiResponse.needsFollowUp,
        },
      });
    } catch (error) {
      console.error('Voice conversation error:', error);

      // Clean up the file if it exists
      if (req.file?.path) {
        try {
          await unlinkAsync(req.file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to process voice conversation',
      });
    }
  }

  /**
   * Get available voices
   */
  async getVoices(req, res) {
    try {
      const voices = await elevenLabsService.getVoices();

      res.json({
        success: true,
        data: voices,
      });
    } catch (error) {
      console.error('Get voices error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch voices',
      });
    }
  }

  /**
   * Get voice details
   */
  async getVoiceDetails(req, res) {
    try {
      const { voiceId } = req.params;

      const voiceDetails = await elevenLabsService.getVoiceDetails(voiceId);

      res.json({
        success: true,
        data: voiceDetails,
      });
    } catch (error) {
      console.error('Get voice details error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch voice details',
      });
    }
  }
}

export const voiceController = new VoiceController();
export default voiceController;

