import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Setup monthly support
 */
export async function setupSupport(req: Request, res: Response) {
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

    const { recipientId, amount } = req.body;

    // Verify users are matched
    const match = await prisma.like.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: recipientId, matched: true },
          { senderId: recipientId, receiverId: req.user.userId, matched: true },
        ],
      },
    });

    if (!match) {
      return res.status(403).json({
        success: false,
        error: 'You can only setup support for matched users',
      });
    }

    // Check if support already exists
    const existingSupport = await prisma.monthlySupport.findFirst({
      where: {
        providerId: req.user.userId,
        recipientId,
        status: 'ACTIVE',
      },
    });

    if (existingSupport) {
      return res.status(400).json({
        success: false,
        error: 'Support already exists for this user',
      });
    }

    // Create support agreement
    const support = await prisma.monthlySupport.create({
      data: {
        providerId: req.user.userId,
        recipientId,
        amount,
        status: 'ACTIVE',
        custodyHours: 48,
      },
    });

    logger.info(`Monthly support created: ${req.user.userId} -> ${recipientId} (${amount})`);

    res.status(201).json({
      success: true,
      data: support,
      message: 'Monthly support setup successfully',
    });
  } catch (error) {
    logger.error('Error in setupSupport:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get active support agreements
 */
export async function getActiveSupport(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const supports = await prisma.monthlySupport.findMany({
      where: {
        OR: [
          { providerId: req.user.userId },
          { recipientId: req.user.userId },
        ],
        status: 'ACTIVE',
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
      },
    });

    // Parse photos
    const parsedSupports = supports.map((support) => ({
      ...support,
      provider: {
        ...support.provider,
        photos: JSON.parse(support.provider.photos),
      },
      recipient: {
        ...support.recipient,
        photos: JSON.parse(support.recipient.photos),
      },
    }));

    res.json({
      success: true,
      data: parsedSupports,
    });
  } catch (error) {
    logger.error('Error in getActiveSupport:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Release funds from custody
 */
export async function releaseFunds(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { supportId } = req.params;

    const support = await prisma.monthlySupport.findUnique({
      where: { id: supportId },
    });

    if (!support) {
      return res.status(404).json({
        success: false,
        error: 'Support not found',
      });
    }

    if (support.recipientId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the recipient can release funds',
      });
    }

    // Check if 48 hours have passed
    const now = new Date();
    const createdAt = new Date(support.createdAt);
    const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursPassed < support.custodyHours) {
      return res.status(400).json({
        success: false,
        error: `Funds can only be released after ${support.custodyHours} hours`,
        hoursRemaining: support.custodyHours - hoursPassed,
      });
    }

    // In production, this would trigger actual payment release
    // For now, just update status

    await prisma.monthlySupport.update({
      where: { id: supportId },
      data: { releasedAt: now },
    });

    logger.info(`Funds released for support ${supportId}`);

    res.json({
      success: true,
      message: 'Funds released successfully',
    });
  } catch (error) {
    logger.error('Error in releaseFunds:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Cancel support agreement
 */
export async function cancelSupport(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { supportId } = req.params;

    const support = await prisma.monthlySupport.findUnique({
      where: { id: supportId },
    });

    if (!support) {
      return res.status(404).json({
        success: false,
        error: 'Support not found',
      });
    }

    if (support.providerId !== req.user.userId && support.recipientId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await prisma.monthlySupport.update({
      where: { id: supportId },
      data: { status: 'CANCELLED' },
    });

    logger.info(`Support cancelled: ${supportId}`);

    res.json({
      success: true,
      message: 'Support cancelled successfully',
    });
  } catch (error) {
    logger.error('Error in cancelSupport:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get support status
 */
export async function getSupportStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { supportId } = req.params;

    const support = await prisma.monthlySupport.findUnique({
      where: { id: supportId },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!support) {
      return res.status(404).json({
        success: false,
        error: 'Support not found',
      });
    }

    if (support.providerId !== req.user.userId && support.recipientId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    // Calculate time remaining
    const now = new Date();
    const createdAt = new Date(support.createdAt);
    const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, support.custodyHours - hoursPassed);

    res.json({
      success: true,
      data: {
        ...support,
        hoursRemaining,
        canRelease: hoursRemaining === 0 && !support.releasedAt,
      },
    });
  } catch (error) {
    logger.error('Error in getSupportStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get support history
 */
export async function getSupportHistory(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const supports = await prisma.monthlySupport.findMany({
      where: {
        OR: [
          { providerId: req.user.userId },
          { recipientId: req.user.userId },
        ],
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: supports,
    });
  } catch (error) {
    logger.error('Error in getSupportHistory:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

