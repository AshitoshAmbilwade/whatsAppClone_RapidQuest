// src/models/PayloadLog.js
import mongoose from 'mongoose';

const PayloadLogSchema = new mongoose.Schema(
  {
    payload_type: String,
    raw_payload: { type: Object, required: true },
    processed: { type: Boolean, default: false },
    error_message: { type: String },
    source: { type: String, default: 'file-import' }, // file-import or webhook
  },
  { timestamps: true }
);

const PayloadLog = mongoose.model('PayloadLog', PayloadLogSchema);
export default PayloadLog;
