import express from 'express';
import multer from 'multer';
import { voiceController } from '../controllers/voiceController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|webm|ogg|mpeg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Speech-to-text
router.post('/speech-to-text', upload.single('audio'), voiceController.speechToText.bind(voiceController));

// Text-to-speech
router.post('/text-to-speech', voiceController.textToSpeech.bind(voiceController));

// Stream text-to-speech
router.post('/text-to-speech/stream', voiceController.streamTextToSpeech.bind(voiceController));

// Complete voice conversation
router.post('/conversation', upload.single('audio'), voiceController.voiceConversation.bind(voiceController));

// Get available voices
router.get('/voices', voiceController.getVoices.bind(voiceController));

// Get voice details
router.get('/voices/:voiceId', voiceController.getVoiceDetails.bind(voiceController));

export default router;

