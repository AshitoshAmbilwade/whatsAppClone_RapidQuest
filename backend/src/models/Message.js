// src/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true }, // Contact phone number
    name: { type: String, default: 'Unknown' }, // Contact name
    message_id: { type: String, required: true, unique: true }, // WhatsApp message ID
    direction: { type: String, enum: ['incoming', 'outgoing'], default: 'incoming' },
    type: { type: String, default: 'text' }, // text, image, etc.
    text: { type: String }, // Text content
    media: {
      url: String,
      mimeType: String,
      filename: String,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    phone_number_id: String,
    display_phone_number: String,
    timestamp: { type: Date, required: true },
    raw_payload: { type: Object }, // Store entire payload for debugging
    source: { type: String, default: 'webhook' }, // webhook, file-import, etc.
  },
  { timestamps: true }
);

// Indexes for query performance
MessageSchema.index({ wa_id: 1, timestamp: -1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
