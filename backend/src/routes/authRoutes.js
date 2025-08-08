// src/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const router = express.Router();

// Admin registration
router.post('/register', validateRequest(registerSchema), register);

// Admin login
router.post('/login', validateRequest(loginSchema), login);

export default router;
