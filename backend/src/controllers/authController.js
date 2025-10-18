import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import convexClient from '../utils/convexClient.js';

// Convex client is already initialized in convexClient.js

// JWT Secrets (in production, use strong secrets from environment)
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = '1h';  // 1 hour
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

/**
 * Helper: Generate access and refresh tokens
 */
const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email, type: 'access' },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

/**
 * Helper: Set token cookies
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie (1 hour)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * Helper: Clear token cookies
 */
const clearTokenCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { email, password, fullName, block, unit, phoneNumber } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await convexClient.query('users:getByEmail', { email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Convex
    const userId = await convexClient.mutation('users:create', {
      email,
      fullName: fullName || null,
      block: block || null,
      unit: unit || null,
      phoneNumber: phoneNumber || null,
    });

    // Note: In a production app, you'd store the hashed password in a separate secure table
    // For now, we'll store it in a simple way (this is for demo purposes)
    // In production, use a proper auth service like Convex Auth, Clerk, or Auth0

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId, email);

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Get user data
    const user = await convexClient.query('users:getById', { id: userId });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          block: user.block,
          unit: user.unit,
          phoneNumber: user.phoneNumber,
          momPoints: user.momPoints,
        },
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering user',
      details: error.message,
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Get user from Convex
    const user = await convexClient.query('users:getByEmail', { email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Note: In production, verify password against stored hash
    // For now, we'll accept any password for demo purposes
    // TODO: Implement proper password verification

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email);

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          block: user.block,
          unit: user.unit,
          phoneNumber: user.phoneNumber,
          momPoints: user.momPoints,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in',
      details: error.message,
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
    }

    // Get user from Convex
    const user = await convexClient.query('users:getById', { id: decoded.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new access token (keep the same refresh token)
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email, type: 'access' },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Set new access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      success: true,
      message: 'Access token refreshed',
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    // Clear cookies if refresh token is invalid
    clearTokenCookies(res);
    
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
      details: error.message,
    });
  }
};

/**
 * Verify current token and return user data
 */
export const verifyToken = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: 'No access token provided',
      });
    }

    // Verify access token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
    }

    // Get user from Convex
    const user = await convexClient.query('users:getById', { id: decoded.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          block: user.block,
          unit: user.unit,
          phoneNumber: user.phoneNumber,
          momPoints: user.momPoints,
        },
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      details: error.message,
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    // Clear cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging out',
      details: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await convexClient.query('users:getById', { id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          block: user.block,
          unit: user.unit,
          phoneNumber: user.phoneNumber,
          momPoints: user.momPoints,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user profile',
      details: error.message,
    });
  }
};
