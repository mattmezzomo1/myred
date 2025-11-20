import { Router } from 'express';
import * as matchingController from '../controllers/matching.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/matching/like/:userId
 * @desc    Like a user
 * @access  Private
 */
router.post('/like/:userId', authenticate, matchingController.likeUser);

/**
 * @route   POST /api/v1/matching/pass/:userId
 * @desc    Pass on a user
 * @access  Private
 */
router.post('/pass/:userId', authenticate, matchingController.passUser);

/**
 * @route   GET /api/v1/matching/matches
 * @desc    Get all matches
 * @access  Private
 */
router.get('/matches', authenticate, matchingController.getMatches);

/**
 * @route   DELETE /api/v1/matching/unmatch/:userId
 * @desc    Unmatch with a user
 * @access  Private
 */
router.delete('/unmatch/:userId', authenticate, matchingController.unmatch);

export default router;

