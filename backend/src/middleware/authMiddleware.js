// src/middleware/authMiddleware.js
import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
