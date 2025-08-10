// backend/controllers/messageController.js
import Message from '../models/Message.js';
import { processPayload } from '../utils/payloadProcessor.js';

/**
 * Handle incoming webhook payload (message or status update)
 */
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

/**
 * Get all messages for a specific contact by wa_id
 */
export const getMessagesByWaId = async (req, res) => {
    try {
        const { wa_id } = req.params;
        const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ Fetch messages error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Send a message (demo only, store in DB + emit via Socket.IO)
 */
export const sendMessage = async (req, res) => {
    try {
        const { wa_id, name, text, sender_wa_id } = req.body;

        // Determine message direction
        const direction = sender_wa_id === wa_id ? 'incoming' : 'outgoing';

        const newMsg = await Message.create({
            wa_id,
            name,
            message_id: `local-${Date.now()}`, // Local ID for demo
            meta_msg_id: `local-${Date.now()}`,
            type: 'text',
            text,
            timestamp: new Date(),
            status: 'sent',
            direction,
        });

        // Emit via Socket.IO to receiver & sender rooms
        const io = req.app.get('io');
        io.to(wa_id).emit('new_message', newMsg);
        io.to(sender_wa_id).emit('message_sent', newMsg);

        res.status(201).json({ success: true, message: newMsg });
    } catch (error) {
        console.error('❌ Send message error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
