import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { JWTPayload } from '../types/index.js';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as string;
const JWT_EXPIRE: StringValue = (process.env.JWT_EXPIRES_IN || '24h') as StringValue;

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode JWT token without verification
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const refreshSecret: Secret = (process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key') as string;
  const refreshExpire: StringValue = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue;
  
  const options: SignOptions = {
    expiresIn: refreshExpire,
  };

  return jwt.sign(payload, refreshSecret, options);
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const refreshSecret: Secret = (process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key') as string;
    return jwt.verify(token, refreshSecret) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
