// backend/utils/payloadProcessor.js
import Message from '../models/Message.js';

export const processPayload = async (payload) => {
  try {
    if (!payload?.metaData?.entry) return;

    const changes = payload.metaData.entry[0]?.changes || [];
    for (const change of changes) {
      const value = change.value;

      // Message payloads
      if (change.field === 'messages' && value?.messages) {
        const contact = value.contacts?.[0] || {};
        const msg = value.messages?.[0] || {};
        const contactWaId = contact.wa_id || null;
        const name = contact.profile?.name || null;

        // business number from payload metadata
        const businessNumber =
          value.metadata?.display_phone_number ||
          value.metadata?.phone_number_id ||
          null;

        const sender = msg.from;
        const receiver = businessNumber; // webhook receiver is business number

        const direction = sender === businessNumber ? 'outgoing' : 'incoming';

        const newMessage = {
          wa_id: contactWaId,                 // contact id (legacy)
          name,
          message_id: msg.id,
          meta_msg_id: msg.id,
          type: msg.type,
          text: msg.text?.body || null,
          timestamp: new Date(parseInt(msg.timestamp) * 1000),
          status: 'sent',
          direction,
          sender_wa_id: sender,
          receiver_wa_id: receiver
        };

        await Message.create(newMessage);
        console.log(`💾 Message stored: ${msg.id}`);
      }

      // Status payloads
      if (change.field === 'statuses' && value?.id) {
        const { id, status } = value;
        const updatedMsg = await Message.findOneAndUpdate(
          {
            $or: [{ message_id: id }, { meta_msg_id: id }]
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
