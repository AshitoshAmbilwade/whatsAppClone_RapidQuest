// backend/utils/payloadProcessor.js
import Message from '../models/Message.js';

/**
 * Process an incoming WhatsApp webhook payload (message or status).
 * Inserts new messages or updates existing message statuses.
 */
export const processPayload = async (payload) => {
    try {
        if (!payload?.metaData?.entry) {
            console.warn('⚠️ Invalid payload format');
            return;
        }

        const changes = payload.metaData.entry[0]?.changes || [];
        for (const change of changes) {
            const value = change.value;

            // 1️⃣ Handle Message Payloads
            if (change.field === 'messages' && value?.messages) {
                const contact = value.contacts?.[0] || {};
                const msg = value.messages?.[0] || {};
                const wa_id = contact.wa_id;
                const name = contact.profile?.name || null;

                const direction =
                    msg.from === wa_id ? 'incoming' : 'outgoing';

                const newMessage = {
                    wa_id,
                    name,
                    message_id: msg.id,
                    meta_msg_id: msg.id, // Currently using same as message_id
                    type: msg.type,
                    text: msg.text?.body || null,
                    timestamp: new Date(parseInt(msg.timestamp) * 1000),
                    status: 'sent', // Default until status update arrives
                    direction,
                };

                await Message.create(newMessage);
                console.log(`💾 Message stored: ${msg.id}`);
            }

            // 2️⃣ Handle Status Payloads
            if (change.field === 'statuses' && value?.id) {
                const { id, status } = value;

                const updatedMsg = await Message.findOneAndUpdate(
                    {
                        $or: [
                            { message_id: id },
                            { meta_msg_id: id }
                        ]
                    },
                    { status },
                    { new: true }
                );

                if (updatedMsg) {
                    console.log(`✅ Status updated for ${id} → ${status}`);
                } else {
                    console.warn(`⚠️ No message found for status update: ${id}`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error processing payload:', error);
    }
};
