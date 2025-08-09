// src/services/payloadProcessor.js
import Message from '../models/Message.js';
import PayloadLog from '../models/PayloadLog.js';
import { updateMessageStatus } from './statusService.js'; // make sure path is correct

/**
 * Process a WhatsApp webhook or manual payload and emit real-time events.
 * @param {Object} payload - raw JSON payload
 * @param {String} source - 'webhook' | 'file-import'
 * @param {Object} io - optional Socket.IO instance (req.app.get('io'))
 */
export const processPayload = async (payload, source = 'webhook', io = null) => {
  try {
    // 1) Save raw payload for auditing
    const log = await PayloadLog.create({
      payload_type: payload.payload_type || payload.type || 'whatsapp_webhook',
      raw_payload: payload,
      processed: false,
      source
    });

    // 2) Normalize to entries/changes/value (support several payload shapes)
    const entries = payload?.metaData?.entry
      || payload?.entry
      || payload?.entries
      || (payload?.object ? payload.metaData?.entry : undefined)
      || [];

    // counters for response
    let insertedCount = 0;
    let statusUpdatedCount = 0;

    // helper to safely extract nested arrays
    const safeArray = (x) => (Array.isArray(x) ? x : []);

    for (const entry of safeArray(entries)) {
      const changes = safeArray(entry.changes || entry.change || entry.changes || []);

      for (const change of changes) {
        // value sometimes sits directly on change.value
        const value = change.value || change || entry.value || entry;

        // -------------- messages --------------
        const messages = safeArray(value.messages || []);
        for (const msg of messages) {
          // build message doc
          const msgId = msg.id || msg.message_id || msg.mid;
          if (!msgId) continue;

          const contact = (value.contacts && value.contacts[0]) || (msg.contacts && msg.contacts[0]) || {};
          const metadata = value.metadata || value.meta || value.messaging_product || {};

          const direction = msg.from === contact?.wa_id ? 'incoming' : 'outgoing';
          const timestampSecs = Number(msg.timestamp || msg.time || msg.ts) || null;
          const timestamp = timestampSecs ? new Date(Number(timestampSecs) * 1000) : new Date();

          const newDoc = {
            wa_id: contact?.wa_id || msg.from || '',
            name: contact?.profile?.name || contact?.name || msg.profile?.name || 'Unknown',
            message_id: msgId,
            direction,
            type: msg.type || (msg.text ? 'text' : 'unknown'),
            text: msg.text?.body || (msg.text && msg.text.body) || '',
            media: msg.media || {},
            status: 'sent',
            phone_number_id: metadata?.phone_number_id || metadata?.phone_number_id || '',
            display_phone_number: metadata?.display_phone_number || '',
            timestamp,
            raw_payload: payload,
            source
          };

          // Upsert: insert only if not exists
          const updateRes = await Message.updateOne(
            { message_id: msgId },
            { $setOnInsert: newDoc },
            { upsert: true }
          );

          // Mongo response: check upsertedCount (native driver prop)
          // Mongoose's updateOne returns an object with `upsertedCount` in newer versions or `upsertedId`.
          // We'll check both to be safe.
          const upserted = updateRes.upsertedCount > 0 || (updateRes.upsertedId && Object.keys(updateRes.upsertedId).length > 0);

          if (upserted) {
            insertedCount += 1;
            // fetch saved document to emit full doc
            const saved = await Message.findOne({ message_id: msgId });
            if (io) io.emit('new_message', saved);
          }
        } // end messages loop

        // -------------- statuses --------------
        const statuses = safeArray(value.statuses || value.status || []);
        for (const st of statuses) {
          // status payloads often have `id` matching message_id, but some providers use meta_msg_id
          const statusId = st.id || st.message_id || st.meta_msg_id || st.meta_msg_id || null;
          const newStatus = st.status || st.state || null;
          if (!statusId || !newStatus) continue;

          // Use the shared status service to avoid downgrades
          await updateMessageStatus(statusId, newStatus);

          // Optionally update updatedAt in DB and count
          const updated = await Message.updateOne(
            { message_id: statusId },
            { $set: { updatedAt: new Date() } }
          );

          if (updated.modifiedCount > 0 || updated.matchedCount > 0) {
            statusUpdatedCount += 1;
            if (io) io.emit('message_status_update', { message_id: statusId, status: newStatus });
          }
        } // end statuses loop
      } // end changes loop
    } // end entries loop

    // 3) mark payload log processed
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
