import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Register a new user
 */
export async function register(req: Request, res: Response) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, name, userType, age, location, bio, photos } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType,
        age,
        location,
        bio: bio || '',
        photos: photos ? JSON.stringify(photos) : JSON.stringify([]),
        verified: false,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.email, user.userType);

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          age: user.age,
          location: user.location,
          bio: user.bio,
          photos: JSON.parse(user.photos),
          verified: user.verified,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error('Error in register:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.email, user.userType);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          age: user.age,
          location: user.location,
          bio: user.bio,
          photos: JSON.parse(user.photos),
          verified: user.verified,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error('Error in login:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { refreshToken } = req.body;

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new tokens
    const tokens = generateTokenPair(user.id, user.email, user.userType);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    logger.error('Error in refreshToken:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
}

/**
 * Logout user
 */
export async function logout(req: Request, res: Response) {
  try {
    // In a production app, you would invalidate the refresh token here
    // For now, we'll just return success
    logger.info(`User logged out: ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Error in logout:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        verification: true,
        emergencyContacts: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        age: user.age,
        location: user.location,
        bio: user.bio,
        photos: JSON.parse(user.photos),
        verified: user.verified,
        verification: user.verification,
        emergencyContacts: user.emergencyContacts,
      },
    });
  } catch (error) {
    logger.error('Error in getCurrentUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Change password
 */
export async function changePassword(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

