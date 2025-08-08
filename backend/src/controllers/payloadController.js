import { processPayload } from '../services/payloadProcessor.js';

export const handlePayload = async (req, res, next) => {
  try {
    const result = await processPayload(req.body, 'webhook');
    if (!result.success) {
      res.status(400);
      throw new Error(result.error);
    }
    res.status(201).json({ message: 'Payload processed successfully' });
  } catch (error) {
    next(error);
  }
};
