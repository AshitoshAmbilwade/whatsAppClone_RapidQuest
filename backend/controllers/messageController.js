// backend/controllers/messageController.js
import Message from '../models/Message.js';
import { processPayload } from '../utils/payloadProcessor.js';

// Handle incoming webhook payloads
export const webhookHandler = async (req, res) => {
  try {
    const payload = req.body;
    await processPayload(payload);
    res.status(200).json({ success: true, message: 'Payload processed' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch all messages for a conversation between the logged-in user & contact
export const getMessagesByWaId = async (req, res) => {
  try {
    const contactWaId = req.params.wa_id;
    const currentUser = req.query.user;

    if (!currentUser) {
      return res.status(400).json({
        success: false,
        message: 'Missing user query param: user=<currentUserWaId>'
      });
    }

    // Only fetch messages between these two participants
    const messages = await Message.find({
      $or: [
        { sender_wa_id: currentUser, receiver_wa_id: contactWaId },
        { sender_wa_id: contactWaId, receiver_wa_id: currentUser }
      ]
    })
      .sort({ timestamp: 1 }) // oldest first for chat display
      .lean();

    res.json({ success: true, messages });
  } catch (error) {
    console.error('❌ Fetch messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Send a message (demo, not WhatsApp API)
export const sendMessage = async (req, res) => {
  try {
    const { text, sender_wa_id, receiver_wa_id, name } = req.body;

    if (!sender_wa_id || !receiver_wa_id || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'sender_wa_id, receiver_wa_id, and text are required'
      });
    }

    const localId = `local-${Date.now()}`;
    const newMsg = await Message.create({
      wa_id: receiver_wa_id, // kept for compatibility
      name: name || null,
      message_id: localId,
      meta_msg_id: localId,
      type: 'text',
      text: text.trim(),
      timestamp: new Date(),
      status: 'sent',
      direction: 'outgoing',
      sender_wa_id,
      receiver_wa_id
    });

    // Emit to the specific conversation room
    const io = req.app.get('io');
    const roomId = [sender_wa_id, receiver_wa_id].sort().join('-');
    io?.to(roomId).emit('new_message', newMsg);

    res.status(201).json({ success: true, message: newMsg });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

