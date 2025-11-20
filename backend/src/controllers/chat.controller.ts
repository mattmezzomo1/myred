import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { moderateContent } from '../utils/moderation';

const prisma = new PrismaClient();

/**
 * Get all conversations
 */
export async function getConversations(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.userId },
          { receiverId: req.user.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId = message.senderId === req.user!.userId ? message.receiverId : message.senderId;
      const partner = message.senderId === req.user!.userId ? message.receiver : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          userId: partnerId,
          name: partner.name,
          photo: JSON.parse(partner.photos)[0] || null,
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.receiverId === req.user!.userId && !message.read) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    logger.error('Error in getConversations:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get messages with a specific user
 */
export async function getMessages(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { userId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error('Error in getMessages:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Send a message
 */
export async function sendMessage(req: Request, res: Response) {
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

    const { userId } = req.params;
    const { text } = req.body;

    // Check if users are matched
    const match = await prisma.like.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: userId, matched: true },
          { senderId: userId, receiverId: req.user.userId, matched: true },
        ],
      },
    });

    if (!match) {
      return res.status(403).json({
        success: false,
        error: 'You can only message matched users',
      });
    }

    // Moderate content
    const moderation = moderateContent(text);

    if (moderation.flagged && moderation.severity === 'high') {
      logger.warn(`High severity message flagged from ${req.user.userId}: ${moderation.reason}`);

      return res.status(400).json({
        success: false,
        error: 'Message contains inappropriate content',
        moderation,
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.userId,
        receiverId: userId,
        text,
        flagged: moderation.flagged,
        read: false,
      },
    });

    // Log flagged messages
    if (moderation.flagged) {
      logger.warn(`Message flagged: ${message.id} - ${moderation.reason}`);
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    logger.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Mark message as read
 */
export async function markAsRead(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    if (message.receiverId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    logger.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    if (message.senderId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own messages',
      });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

