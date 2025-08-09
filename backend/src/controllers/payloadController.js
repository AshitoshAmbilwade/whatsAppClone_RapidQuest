import { processPayload } from '../services/payloadProcessor.js';

// POST /api/payload  (public endpoint)
export const handlePayload = async (req, res, next) => {
  try {
    const io = req.app.get('io') || null;
    const result = await processPayload(req.body, 'webhook', io);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.status(201).json({
      success: true,
      message: 'Payload processed successfully',
      insertedCount: result.insertedCount,
      statusUpdatedCount: result.statusUpdatedCount
    });
  } catch (error) {
    next(error);
  }
};
