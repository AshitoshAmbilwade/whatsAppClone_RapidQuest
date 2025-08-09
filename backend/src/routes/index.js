// src/routes/index.js
import express from 'express';
import payloadRoutes from './payloadRoutes.js';
import messageRoutes from './messageRoutes.js';
import webhookRoutes from './webhookRoutes.js';

const router = express.Router();


router.use('/payload', payloadRoutes);
router.use('/messages', messageRoutes);
router.use('/webhook', webhookRoutes);

export default router;
