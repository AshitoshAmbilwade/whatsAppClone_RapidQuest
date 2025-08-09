// src/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true },
    name: { type: String, default: 'Unknown' },
    message_id: { type: String, required: true, unique: true },
    direction: { type: String, enum: ['incoming', 'outgoing'], default: 'incoming' },
    type: { type: String, default: 'text' },
    text: { type: String },
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
    raw_payload: { type: Object },
    source: { type: String, default: 'webhook' },
  },
  {
    timestamps: true,
    collection: 'processed_messages' // ✅ Force this exact collection name
  }
);

MessageSchema.index({ wa_id: 1, timestamp: -1 });

const ProcessedMessage = mongoose.model('ProcessedMessage', MessageSchema);
export default ProcessedMessage;
