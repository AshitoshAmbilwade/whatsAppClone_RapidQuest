// src/routes/messageRoutes.js
import express from 'express';
import { listConversations, listMessages, searchMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', protect, listConversations);

// Get messages for a specific wa_id
router.get('/:wa_id', protect, listMessages);

// Search messages
router.get('/search', protect, searchMessages);

export default router;
