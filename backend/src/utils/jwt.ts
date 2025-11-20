import jwt from 'jsonwebtoken';
import { config } from './config';

export interface JWTPayload {
  userId: string;
  email: string;
  userType: 'WOMAN' | 'MAN';
}

export interface RefreshTokenPayload {
  userId: string;
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(userId: string, email: string, userType: 'WOMAN' | 'MAN') {
  const accessToken = generateAccessToken({ userId, email, userType });
  const refreshToken = generateRefreshToken({ userId });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
  };
}

