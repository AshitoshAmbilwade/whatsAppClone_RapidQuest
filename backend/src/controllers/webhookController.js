import { processPayload } from '../services/payloadProcessor.js';

export const webhookVerify = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  console.log('Token from env:', VERIFY_TOKEN);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};

export const webhookReceive = async (req, res, next) => {
  try {
    const payload = req.body;
    const io = req.app.get('io'); // Access Socket.IO instance

    // Pass io into processPayload so it can emit events
    const result = await processPayload(payload, 'webhook', io);

    if (!result.success) {
      res.status(400);
      throw new Error(result.error);
    }

    // No need to manually emit here — processPayload handles it internally
    res.sendStatus(200); // WhatsApp expects quick 200
  } catch (error) {
    next(error);
  }
};
