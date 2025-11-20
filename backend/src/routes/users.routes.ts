import { Router } from 'express';
import { body } from 'express-validator';
import * as usersController from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/v1/users/profiles
 * @desc    Get profiles for matching (opposite gender)
 * @access  Private
 */
router.get('/profiles', authenticate, usersController.getProfiles);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, usersController.getUserById);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('age').optional().isInt({ min: 18, max: 100 }),
    body('location').optional().trim().notEmpty(),
    body('bio').optional().trim(),
    body('photos').optional().isArray(),
  ],
  usersController.updateProfile
);

/**
 * @route   POST /api/v1/users/photos
 * @desc    Upload profile photo
 * @access  Private
 */
router.post('/photos', authenticate, usersController.uploadPhoto);

/**
 * @route   DELETE /api/v1/users/photos/:index
 * @desc    Delete profile photo
 * @access  Private
 */
router.delete('/photos/:index', authenticate, usersController.deletePhoto);

/**
 * @route   POST /api/v1/users/emergency-contact
 * @desc    Add emergency contact
 * @access  Private
 */
router.post(
  '/emergency-contact',
  authenticate,
  [
    body('name').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('relation').trim().notEmpty(),
  ],
  usersController.addEmergencyContact
);

/**
 * @route   DELETE /api/v1/users/emergency-contact/:id
 * @desc    Delete emergency contact
 * @access  Private
 */
router.delete('/emergency-contact/:id', authenticate, usersController.deleteEmergencyContact);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticate, usersController.deleteAccount);

export default router;

