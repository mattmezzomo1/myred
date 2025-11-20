import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Get profiles for matching (opposite gender, not already liked/matched)
 */
export async function getProfiles(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get opposite gender
    const oppositeGender = currentUser.userType === 'WOMAN' ? 'MAN' : 'WOMAN';

    // Get users already liked/matched
    const likedUsers = await prisma.like.findMany({
      where: { senderId: currentUser.id },
      select: { receiverId: true },
    });

    const likedUserIds = likedUsers.map((like) => like.receiverId);

    // Get profiles
    const profiles = await prisma.user.findMany({
      where: {
        userType: oppositeGender,
        id: {
          not: currentUser.id,
          notIn: likedUserIds,
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        location: true,
        bio: true,
        photos: true,
        verified: true,
        verification: {
          select: {
            fullyVerified: true,
          },
        },
      },
      take: 20,
    });

    // Parse photos JSON
    const parsedProfiles = profiles.map((profile) => ({
      ...profile,
      photos: JSON.parse(profile.photos),
    }));

    res.json({
      success: true,
      data: parsedProfiles,
    });
  } catch (error) {
    logger.error('Error in getProfiles:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get user by ID
 */
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        age: true,
        location: true,
        bio: true,
        photos: true,
        verified: true,
        userType: true,
        verification: {
          select: {
            fullyVerified: true,
            documentStatus: true,
            selfieStatus: true,
            videoStatus: true,
          },
        },
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
        ...user,
        photos: JSON.parse(user.photos),
      },
    });
  } catch (error) {
    logger.error('Error in getUserById:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req: Request, res: Response) {
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

    const { name, age, location, bio, photos } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
    });

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        age: user.age,
        location: user.location,
        bio: user.bio,
        photos: JSON.parse(user.photos),
      },
    });
  } catch (error) {
    logger.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Upload profile photo
 */
export async function uploadPhoto(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // In production, this would handle file upload to cloud storage
    // For now, we'll just accept a URL
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Photo URL is required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const photos = JSON.parse(user.photos);
    photos.push(photoUrl);

    await prisma.user.update({
      where: { id: user.id },
      data: { photos: JSON.stringify(photos) },
    });

    res.json({
      success: true,
      data: { photos },
    });
  } catch (error) {
    logger.error('Error in uploadPhoto:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Delete profile photo
 */
export async function deletePhoto(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { index } = req.params;
    const photoIndex = parseInt(index, 10);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const photos = JSON.parse(user.photos);

    if (photoIndex < 0 || photoIndex >= photos.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo index',
      });
    }

    photos.splice(photoIndex, 1);

    await prisma.user.update({
      where: { id: user.id },
      data: { photos: JSON.stringify(photos) },
    });

    res.json({
      success: true,
      data: { photos },
    });
  } catch (error) {
    logger.error('Error in deletePhoto:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Add emergency contact
 */
export async function addEmergencyContact(req: Request, res: Response) {
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

    const { name, phone, relation } = req.body;

    const contact = await prisma.emergencyContact.create({
      data: {
        userId: req.user.userId,
        name,
        phone,
        relation,
      },
    });

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    logger.error('Error in addEmergencyContact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Delete emergency contact
 */
export async function deleteEmergencyContact(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { id } = req.params;

    // Verify ownership
    const contact = await prisma.emergencyContact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    if (contact.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await prisma.emergencyContact.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteEmergencyContact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // Delete all related data
    await prisma.$transaction([
      prisma.emergencyContact.deleteMany({ where: { userId: req.user.userId } }),
      prisma.panicAlert.deleteMany({ where: { userId: req.user.userId } }),
      prisma.report.deleteMany({ where: { reporterId: req.user.userId } }),
      prisma.message.deleteMany({ where: { OR: [{ senderId: req.user.userId }, { receiverId: req.user.userId }] } }),
      prisma.like.deleteMany({ where: { OR: [{ senderId: req.user.userId }, { receiverId: req.user.userId }] } }),
      prisma.verification.deleteMany({ where: { userId: req.user.userId } }),
      prisma.user.delete({ where: { id: req.user.userId } }),
    ]);

    logger.info(`Account deleted for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteAccount:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

