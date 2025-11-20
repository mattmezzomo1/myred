import { Router } from 'express';
import { body } from 'express-validator';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/v1/chat/conversations
 * @desc    Get all conversations
 * @access  Private
 */
router.get('/conversations', authenticate, chatController.getConversations);

/**
 * @route   GET /api/v1/chat/:userId/messages
 * @desc    Get messages with a specific user
 * @access  Private
 */
router.get('/:userId/messages', authenticate, chatController.getMessages);

/**
 * @route   POST /api/v1/chat/:userId/messages
 * @desc    Send a message
 * @access  Private
 */
router.post(
  '/:userId/messages',
  authenticate,
  [body('text').trim().notEmpty()],
  chatController.sendMessage
);

/**
 * @route   PUT /api/v1/chat/messages/:messageId/read
 * @desc    Mark message as read
 * @access  Private
 */
router.put('/messages/:messageId/read', authenticate, chatController.markAsRead);

/**
 * @route   DELETE /api/v1/chat/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/messages/:messageId', authenticate, chatController.deleteMessage);

export default router;

