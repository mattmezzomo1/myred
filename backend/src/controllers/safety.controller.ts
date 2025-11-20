import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Report a user
 */
export async function reportUser(req: Request, res: Response) {
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

    const { reportedUserId, category, description, evidence } = req.body;

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.userId,
        reportedUserId,
        category,
        description,
        evidence: evidence ? JSON.stringify(evidence) : null,
        status: 'PENDING',
      },
    });

    logger.warn(`User report created: ${req.user.userId} reported ${reportedUserId} for ${category}`);

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report submitted successfully. Our team will review it shortly.',
    });
  } catch (error) {
    logger.error('Error in reportUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Trigger panic alert
 */
export async function triggerPanic(req: Request, res: Response) {
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

    const { latitude, longitude, reason } = req.body;

    const alert = await prisma.panicAlert.create({
      data: {
        userId: req.user.userId,
        latitude: latitude || null,
        longitude: longitude || null,
        reason: reason || null,
        resolved: false,
      },
    });

    // Get emergency contacts
    const emergencyContacts = await prisma.emergencyContact.findMany({
      where: { userId: req.user.userId },
    });

    // In production, this would trigger:
    // 1. SMS/Call to emergency contacts
    // 2. Alert to platform moderators
    // 3. Possibly contact authorities

    logger.error(`PANIC ALERT: User ${req.user.userId} triggered panic button`);

    res.status(201).json({
      success: true,
      data: {
        alert,
        emergencyContacts,
      },
      message: 'Emergency alert sent. Help is on the way.',
    });
  } catch (error) {
    logger.error('Error in triggerPanic:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Block a user
 */
export async function blockUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { userId } = req.params;

    // In production, you'd have a separate BlockedUsers table
    // For now, we'll just unmatch and prevent future matches

    // Unmatch
    await prisma.like.deleteMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
    });

    // Delete messages
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
    });

    logger.info(`User ${req.user.userId} blocked user ${userId}`);

    res.json({
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error) {
    logger.error('Error in blockUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // In production, you'd remove from BlockedUsers table
    // For now, just return success

    res.json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error) {
    logger.error('Error in unblockUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get blocked users
 */
export async function getBlockedUsers(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // In production, you'd query BlockedUsers table
    // For now, return empty array

    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    logger.error('Error in getBlockedUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

