import express from 'express';
import foodRoutes from './foodRoutes.js';
import cleaningRoutes from './cleaningRoutes.js';
import exchangeRoutes from './exchangeRoutes.js';
import voiceRoutes from './voiceRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Everyone Is Your Mom API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/food', foodRoutes);
router.use('/cleaning', cleaningRoutes);
router.use('/exchange', exchangeRoutes);
router.use('/voice', voiceRoutes);
router.use('/ai', aiRoutes);

export default router;

