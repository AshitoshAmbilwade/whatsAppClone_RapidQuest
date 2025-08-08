// src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import payloadRoutes from './payloadRoutes.js';
import messageRoutes from './messageRoutes.js';
import webhookRoutes from './webhookRoutes.js';

const router = express.Router();

// Route mappings
router.use('/auth', authRoutes);
router.use('/payload', payloadRoutes);
router.use('/messages', messageRoutes);
router.use('/webhook', webhookRoutes);

export default router;
