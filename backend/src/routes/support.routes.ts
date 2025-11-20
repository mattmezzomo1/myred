import { Router } from 'express';
import { body } from 'express-validator';
import * as supportController from '../controllers/support.controller';
import { authenticate, requireMan, requireWoman } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/support/setup
 * @desc    Setup monthly support (men only)
 * @access  Private (Men)
 */
router.post(
  '/setup',
  authenticate,
  requireMan,
  [
    body('recipientId').notEmpty(),
    body('amount').isFloat({ min: 0 }),
  ],
  supportController.setupSupport
);

/**
 * @route   GET /api/v1/support/active
 * @desc    Get active support agreements
 * @access  Private
 */
router.get('/active', authenticate, supportController.getActiveSupport);

/**
 * @route   POST /api/v1/support/:supportId/release
 * @desc    Release funds from custody (women only, after 48h)
 * @access  Private (Women)
 */
router.post(
  '/:supportId/release',
  authenticate,
  requireWoman,
  supportController.releaseFunds
);

/**
 * @route   POST /api/v1/support/:supportId/cancel
 * @desc    Cancel support agreement
 * @access  Private
 */
router.post('/:supportId/cancel', authenticate, supportController.cancelSupport);

/**
 * @route   GET /api/v1/support/:supportId/status
 * @desc    Get support status
 * @access  Private
 */
router.get('/:supportId/status', authenticate, supportController.getSupportStatus);

/**
 * @route   GET /api/v1/support/history
 * @desc    Get support history
 * @access  Private
 */
router.get('/history', authenticate, supportController.getSupportHistory);

export default router;

