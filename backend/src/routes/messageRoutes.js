// src/routes/messageRoutes.js
import express from 'express';
import { listConversations, listMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', protect, listConversations);

// Get messages for a specific wa_id
router.get('/:wa_id', protect, listMessages);

export default router;
