// backend/routes/messageRoutes.js
import express from 'express';
import {
  webhookHandler,
  getMessagesByWaId,
  sendMessage
} from '../controllers/messageController.js';

const router = express.Router();

// Webhook for incoming messages
router.post('/webhook', webhookHandler);

// Get all messages for a specific wa_id
router.get('/messages/:wa_id', getMessagesByWaId);

// Send a new message
router.post('/messages', sendMessage);

export default router;
