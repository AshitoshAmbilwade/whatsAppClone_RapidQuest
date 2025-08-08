// src/routes/payloadRoutes.js
import express from 'express';
import { handlePayload } from '../controllers/payloadController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { payloadSchema } from '../utils/validators.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Process incoming payload (protected so only admin can call)
router.post('/', protect, validateRequest(payloadSchema), handlePayload);

export default router;
