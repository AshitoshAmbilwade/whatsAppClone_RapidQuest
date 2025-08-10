// backend/routes/conversationRoutes.js
import express from 'express';
import { getAllConversations } from '../controllers/conversationController.js';

const router = express.Router();

// Get all conversations grouped by wa_id
router.get('/', getAllConversations);

export default router;
