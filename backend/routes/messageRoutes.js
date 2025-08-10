// backend/routes/messageRoutes.js
import express from 'express';
import {
    webhookHandler,
    getMessagesByWaId,
    sendMessage
} from '../controllers/messageController.js';

const router = express.Router();

// Webhook endpoint to process WhatsApp payloads
router.post('/webhook', webhookHandler);

// Get messages for a specific wa_id
router.get('/:wa_id', getMessagesByWaId);

// Send a message (demo)
router.post('/', sendMessage);

export default router;
