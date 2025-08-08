import Message from '../models/Message.js';
import PayloadLog from '../models/PayloadLog.js';

/**
 * Process a WhatsApp webhook payload (message or status)
 * and emit real-time events if Socket.IO is available.
 * 
 * @param {Object} payload - The raw payload from file or webhook
 * @param {String} source - Source of payload ('webhook' or 'file-import')
 * @param {Object} io - Optional Socket.IO instance for real-time updates
 */
export const processPayload = async (payload, source = 'webhook', io = null) => {
  try {
    // Save raw payload to logs
    await PayloadLog.create({
      payload_type: payload.payload_type || 'unknown',
      raw_payload: payload,
      processed: false,
      source,
    });

    // Extract relevant data
    const entry = payload?.metaData?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value) {
      throw new Error('Invalid payload: missing value object');
    }

    const contact = value.contacts?.[0];
    const messageData = value.messages?.[0];
    const statusData = value.statuses?.[0];

    let savedMessage = null;

    if (messageData) {
      // MESSAGE PAYLOAD
      const newMessage = {
        wa_id: contact?.wa_id,
        name: contact?.profile?.name || 'Unknown',
        message_id: messageData.id,
        direction:
          messageData.from === contact?.wa_id ? 'incoming' : 'outgoing',
        type: messageData.type || 'text',
        text: messageData.text?.body || '',
        media: {},
        status: 'sent',
        phone_number_id: value.metadata?.phone_number_id,
        display_phone_number: value.metadata?.display_phone_number,
        timestamp: new Date(Number(messageData.timestamp) * 1000),
        raw_payload: payload,
        source,
      };

      savedMessage = await Message.create(newMessage);

      // Emit real-time event for new message
      if (io) {
        io.emit('new_message', savedMessage);
      }

    } else if (statusData) {
      // STATUS PAYLOAD
      await Message.updateOne(
        { message_id: statusData.id },
        { $set: { status: statusData.status } }
      );

      // Emit real-time status update
      if (io) {
        io.emit('message_status_update', {
          message_id: statusData.id,
          status: statusData.status
        });
      }

    } else {
      throw new Error('Unknown payload type: no messages or statuses found');
    }

    // Mark payload as processed in logs
    await PayloadLog.updateOne(
      { raw_payload: payload },
      { $set: { processed: true } }
    );

    return { success: true, data: savedMessage };
  } catch (error) {
    console.error('Error processing payload:', error.message);
    return { success: false, error: error.message };
  }
};
