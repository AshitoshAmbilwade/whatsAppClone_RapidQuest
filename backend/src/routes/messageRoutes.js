import express from 'express';
import {
  listConversations,
  listMessages,
  searchMessages,
  markMessagesAsRead,
  listMessagesWithFilters,
  createMessage // ✅ new import
} from '../controllers/messageController.js';

import { validateRequest } from '../middleware/validateRequest.js';
import { markReadValidation } from '../validations/messageValidation.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', listConversations);

// Get messages for a specific wa_id
router.get('/:wa_id', listMessages);

// Search messages
router.get('/search', searchMessages);

// Mark messages as read
router.patch(
  '/:wa_id/read',
  validateRequest(markReadValidation, 'params'),
  markMessagesAsRead
);

// Filter messages by wa_id with status/type/date
router.get('/:wa_id/filter', listMessagesWithFilters);

// ✅ Send a new message (demo) — stores into processed_messages
router.post('/', createMessage);

export default router;
