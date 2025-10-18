import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Authentication middleware
 * Verifies JWT tokens from cookies and attaches user info to req.user
 */
export const authMiddleware = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      if (decoded.type === 'access') {
        req.user = {
          id: decoded.userId,
          email: decoded.email,
        };
      }
    } catch (error) {
      console.error('Token verification error:', error.message);
      // Don't block, just don't attach user
    }
  }
  
  next();
};

/**
 * Optional auth - doesn't block if no auth provided
 */
export const optionalAuth = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      if (decoded.type === 'access') {
        req.user = {
          id: decoded.userId,
          email: decoded.email,
        };
      }
    } catch (error) {
      console.error('Token verification error:', error.message);
    }
  }
  
  next();
};

/**
 * Required auth - blocks if no valid auth
 */
export const requireAuth = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
    }
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

