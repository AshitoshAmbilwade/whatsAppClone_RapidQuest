// src/routes/messageRoutes.js
import express from 'express';
import { listConversations, listMessages, searchMessages,markMessagesAsRead,listMessagesWithFilters } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { markReadValidation } from '../validations/messageValidation.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', protect, listConversations);

// Get messages for a specific wa_id
router.get('/:wa_id', protect, listMessages);

// Search messages
router.get('/search', protect, searchMessages);

// Mark messages as read
router.patch('/:wa_id/read', protect, validateRequest(markReadValidation, 'params'), markMessagesAsRead);

router.get('/:wa_id/filter', protect, listMessagesWithFilters);

export default router;
