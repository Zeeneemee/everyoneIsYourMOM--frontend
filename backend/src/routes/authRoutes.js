import express from 'express';
import { register, login, refreshAccessToken, verifyToken, logout, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', refreshAccessToken);

/**
 * POST /api/auth/logout
 * Logout user (clear cookies)
 */
router.post('/logout', logout);

/**
 * GET /api/auth/verify
 * Verify JWT token
 */
router.get('/verify', verifyToken);

/**
 * GET /api/auth/profile
 * Get current user profile (protected route)
 */
router.get('/profile', requireAuth, getProfile);

export default router;

