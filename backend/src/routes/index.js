// src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import payloadRoutes from './payloadRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = express.Router();

// Route mappings
router.use('/auth', authRoutes);
router.use('/payload', payloadRoutes);
router.use('/messages', messageRoutes);

export default router;
