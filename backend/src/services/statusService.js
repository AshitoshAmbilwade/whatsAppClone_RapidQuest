// src/services/statusService.js
import Message from '../models/Message.js';
const ORDER = ['sent','delivered','read'];

export const updateMessageStatus = async (message_id, newStatus) => {
  if (!newStatus) return null;
  const message = await Message.findOne({ message_id });
  if (!message) return null;
  const curIndex = ORDER.indexOf(message.status || 'sent');
  const newIndex = ORDER.indexOf(newStatus);
  if (newIndex > curIndex) {
    message.status = newStatus;
    await message.save();
    return message;
  }
  return message; // unchanged or exists
};
