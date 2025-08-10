// backend/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    wa_id: { type: String },                // legacy / contact id (kept for compatibility)
    name: { type: String },
    message_id: { type: String, required: true },
    meta_msg_id: { type: String },
    type: { type: String },
    text: { type: String },
    timestamp: { type: Date },
    status: { type: String, default: 'sent' },
    direction: { type: String, enum: ['incoming', 'outgoing'] },

    // new explicit fields:
    sender_wa_id: { type: String },         // who sent this message (phone)
    receiver_wa_id: { type: String }        // who received this message (phone)
  },
  {
    timestamps: true,
    collection: 'processed_messages'
  }
);

export default mongoose.model('Message', messageSchema);
