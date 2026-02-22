import express from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get or create conversation with a specific user
router.get('/conversations/with/:userId', getOrCreateConversation);

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Send a message
router.post('/messages', sendMessage);

// Mark conversation as read
router.put('/conversations/:conversationId/read', markAsRead);

// Delete a message
router.delete('/messages/:messageId', deleteMessage);

// Get total unread count
router.get('/unread-count', getUnreadCount);

export default router;