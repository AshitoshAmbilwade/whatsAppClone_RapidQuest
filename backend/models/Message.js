// backend/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        wa_id: { type: String, required: true },       // Contact's WhatsApp ID
        name: { type: String, required: false },       // Contact's name if available
        message_id: { type: String, required: true },  // WhatsApp message ID
        meta_msg_id: { type: String },                 // Optional link for status updates
        type: { type: String, required: true },        // Message type (text, image, etc.)
        text: { type: String },                        // Message text
        timestamp: { type: Date, required: true },     // Message timestamp
        status: { type: String, default: 'sent' },     // sent, delivered, read
        direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
    },
    {
        timestamps: true, // createdAt, updatedAt
        collection: 'processed_messages' // Explicit collection name
    }
);

export default mongoose.model('Message', messageSchema);
