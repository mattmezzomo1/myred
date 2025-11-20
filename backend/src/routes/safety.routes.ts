import { Router } from 'express';
import { body } from 'express-validator';
import * as safetyController from '../controllers/safety.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/safety/report
 * @desc    Report a user
 * @access  Private
 */
router.post(
  '/report',
  authenticate,
  [
    body('reportedUserId').notEmpty(),
    body('category').isIn(['HARASSMENT', 'SEXUALIZATION', 'MANIPULATION', 'THREAT', 'SCAM', 'OTHER']),
    body('description').trim().notEmpty(),
  ],
  safetyController.reportUser
);

/**
 * @route   POST /api/v1/safety/panic
 * @desc    Trigger panic alert
 * @access  Private
 */
router.post(
  '/panic',
  authenticate,
  [
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
    body('reason').optional().trim(),
  ],
  safetyController.triggerPanic
);

/**
 * @route   POST /api/v1/safety/block/:userId
 * @desc    Block a user
 * @access  Private
 */
router.post('/block/:userId', authenticate, safetyController.blockUser);

/**
 * @route   DELETE /api/v1/safety/block/:userId
 * @desc    Unblock a user
 * @access  Private
 */
router.delete('/block/:userId', authenticate, safetyController.unblockUser);

/**
 * @route   GET /api/v1/safety/blocked
 * @desc    Get blocked users
 * @access  Private
 */
router.get('/blocked', authenticate, safetyController.getBlockedUsers);

export default router;

