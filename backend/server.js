import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config, validateConfig } from './src/config/database.js';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import { optionalAuth } from './src/middleware/authMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration Error:', error.message);
  process.exit(1);
}

// Create Express app
const app = express();

// Create temp directory for file uploads
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply optional auth to all routes (user can be identified if token present)
app.use(optionalAuth);

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Everyone Is Your Mom - Backend API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

async function startServer() {
  try {
    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('🏠  Everyone Is Your Mom - Backend API');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`✅  Server running on http://localhost:${PORT}`);
      console.log(`✅  Environment: ${config.nodeEnv}`);
      console.log(`✅  Database: Convex (${config.convex.url ? 'Configured' : 'Not Configured'})`);
      console.log('');
      console.log('📚  API Documentation:');
      console.log(`    Health Check:  http://localhost:${PORT}/api/health`);
      console.log(`    Food API:      http://localhost:${PORT}/api/food`);
      console.log(`    Cleaning API:  http://localhost:${PORT}/api/cleaning`);
      console.log(`    Exchange API:  http://localhost:${PORT}/api/exchange`);
      console.log(`    Voice API:     http://localhost:${PORT}/api/voice`);
      console.log(`    AI Agent API:  http://localhost:${PORT}/api/ai`);
      console.log('');
      console.log('💡  Tip: Run `npx convex dev` in another terminal for database');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

