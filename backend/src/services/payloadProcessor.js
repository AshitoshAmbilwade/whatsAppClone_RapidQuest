import ProcessedMessage from '../models/Message.js';
import PayloadLog from '../models/PayloadLog.js';
import { updateMessageStatus } from './statusService.js';

/**
 * Process a WhatsApp webhook or manual payload (no auth required).
 * Inserts new messages into `processed_messages` collection and updates message statuses.
 * @param {Object} payload - raw JSON payload
 * @param {String} source - 'webhook' | 'file-import'
 * @param {Object} io - optional Socket.IO instance (req.app.get('io'))
 */
export const processPayload = async (payload, source = 'webhook', io = null) => {
  try {
    // Save raw payload for auditing/debugging
    const log = await PayloadLog.create({
      payload_type: payload.payload_type || payload.type || 'whatsapp_webhook',
      raw_payload: payload,
      processed: false,
      source
    });

    const entries = payload?.entry || payload?.entries || [];
    let insertedCount = 0;
    let statusUpdatedCount = 0;

    const safeArray = (x) => (Array.isArray(x) ? x : []);

    for (const entry of safeArray(entries)) {
      const changes = safeArray(entry.changes || []);
      for (const change of changes) {
        const value = change.value || {};

        // ---- Handle messages ----
        for (const msg of safeArray(value.messages)) {
          const msgId = msg.id || msg.message_id;
          if (!msgId) continue;

          const contact = (value.contacts && value.contacts[0]) || {};
          const metadata = value.metadata || {};

          const direction = msg.from === contact?.wa_id ? 'incoming' : 'outgoing';
          const timestamp = msg.timestamp
            ? new Date(Number(msg.timestamp) * 1000)
            : new Date();

          const newDoc = {
            wa_id: contact.wa_id || msg.from || '',
            name: contact?.profile?.name || 'Unknown',
            message_id: msgId,
            direction,
            type: msg.type || 'text',
            text: msg.text?.body || '',
            media: msg.media || {},
            status: 'sent',
            phone_number_id: metadata?.phone_number_id || '',
            display_phone_number: metadata?.display_phone_number || '',
            timestamp,
            raw_payload: payload,
            source
          };

          const updateRes = await Message.updateOne(
            { message_id: msgId },
            { $setOnInsert: newDoc },
            { upsert: true }
          );

          const upserted = updateRes.upsertedCount > 0 ||
            (updateRes.upsertedId && Object.keys(updateRes.upsertedId).length > 0);

          if (upserted) {
            insertedCount++;
            const saved = await Message.findOne({ message_id: msgId });
            if (io) io.emit('new_message', saved);
          }
        }

        // ---- Handle statuses ----
        for (const st of safeArray(value.statuses)) {
          const statusId = st.id || st.message_id || st.meta_msg_id;
          const newStatus = st.status || st.state;
          if (!statusId || !newStatus) continue;

          await updateMessageStatus(statusId, newStatus);

          const updated = await Message.updateOne(
            { message_id: statusId },
            { $set: { updatedAt: new Date() } }
          );

          if (updated.modifiedCount > 0 || updated.matchedCount > 0) {
            statusUpdatedCount++;
            if (io) io.emit('message_status_update', {
              message_id: statusId,
              status: newStatus
            });
          }
        }
      }
    }

    // Mark payload log processed
    await PayloadLog.updateOne(
      { _id: log._id },
      { $set: { processed: true } }
    );

    return { success: true, insertedCount, statusUpdatedCount };
  } catch (error) {
    console.error('Error processing payload:', error);
    return { success: false, error: error.message || String(error) };
  }
};
