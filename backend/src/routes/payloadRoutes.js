// src/routes/payloadRoutes.js
import express from 'express';
import { handlePayload } from '../controllers/payloadController.js';

const router = express.Router();

// Process incoming payload (protected so only admin can call)
router.post('/', handlePayload);

export default router;
