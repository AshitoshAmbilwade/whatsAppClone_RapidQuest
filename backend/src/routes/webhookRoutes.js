import express from 'express';
import { webhookVerify, webhookReceive } from '../controllers/webhookController.js';

const router = express.Router();

// GET → For WhatsApp webhook verification
router.get('/', webhookVerify);

// POST → For receiving WhatsApp messages/status updates
router.post('/', webhookReceive);

export default router;
