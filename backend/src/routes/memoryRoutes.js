import express from 'express';
import { memoryController } from '../controllers/memoryController.js';

const router = express.Router();

/**
 * Memory Management Routes
 * All routes require authentication (authMiddleware applied at router level in index.js)
 */

// Get all memories for authenticated user
router.get('/', memoryController.getUserMemories.bind(memoryController));

// Search memories with query
router.get('/search', memoryController.searchMemories.bind(memoryController));

// Get memory statistics
router.get('/stats', memoryController.getMemoryStats.bind(memoryController));

// Delete a specific memory
router.delete('/:id', memoryController.deleteMemory.bind(memoryController));

// Clear all memories
router.delete('/', memoryController.clearAllMemories.bind(memoryController));

export default router;

