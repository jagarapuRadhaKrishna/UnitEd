import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate JWT tokens
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const user = verifyToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
}

/**
 * Role-based access control middleware
 */
export function roleMiddleware(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
}
