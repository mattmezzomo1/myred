import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Like a user
 */
export async function likeUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { userId } = req.params;

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId: req.user.userId,
        receiverId: userId,
      },
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        error: 'Already liked this user',
      });
    }

    // Check if the other user liked us
    const reciprocalLike = await prisma.like.findFirst({
      where: {
        senderId: userId,
        receiverId: req.user.userId,
      },
    });

    const isMatch = !!reciprocalLike;

    // Create like
    const like = await prisma.like.create({
      data: {
        senderId: req.user.userId,
        receiverId: userId,
        matched: isMatch,
      },
    });

    // If it's a match, update the reciprocal like
    if (isMatch && reciprocalLike) {
      await prisma.like.update({
        where: { id: reciprocalLike.id },
        data: { matched: true },
      });

      logger.info(`New match: ${req.user.userId} <-> ${userId}`);
    }

    res.json({
      success: true,
      data: {
        liked: true,
        matched: isMatch,
      },
    });
  } catch (error) {
    logger.error('Error in likeUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Pass on a user
 */
export async function passUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // In a production app, you might want to store passes to avoid showing the same profile again
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Passed on user',
    });
  } catch (error) {
    logger.error('Error in passUser:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get all matches
 */
export async function getMatches(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // Get all matched likes
    const matches = await prisma.like.findMany({
      where: {
        OR: [
          { senderId: req.user.userId, matched: true },
          { receiverId: req.user.userId, matched: true },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            age: true,
            location: true,
            bio: true,
            photos: true,
            verified: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            age: true,
            location: true,
            bio: true,
            photos: true,
            verified: true,
          },
        },
      },
    });

    // Get the other user in each match
    const matchedUsers = matches.map((match) => {
      const otherUser = match.senderId === req.user!.userId ? match.receiver : match.sender;
      return {
        ...otherUser,
        photos: JSON.parse(otherUser.photos),
        matchedAt: match.createdAt,
      };
    });

    // Remove duplicates
    const uniqueMatches = matchedUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    res.json({
      success: true,
      data: uniqueMatches,
    });
  } catch (error) {
    logger.error('Error in getMatches:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Unmatch with a user
 */
export async function unmatch(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { userId } = req.params;

    // Delete both likes
    await prisma.like.deleteMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
    });

    // Delete all messages between users
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
    });

    logger.info(`Unmatch: ${req.user.userId} <-> ${userId}`);

    res.json({
      success: true,
      message: 'Unmatched successfully',
    });
  } catch (error) {
    logger.error('Error in unmatch:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

