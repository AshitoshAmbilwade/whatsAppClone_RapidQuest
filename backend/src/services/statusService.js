// src/services/statusService.js
import Message from '../models/Message.js';

const statusOrder = ['sent', 'delivered', 'read'];

/**
 * Update message status only if it's a progression
 * @param {String} message_id - WhatsApp message ID
 * @param {String} newStatus - New status value
 */
export const updateMessageStatus = async (message_id, newStatus) => {
  const message = await Message.findOne({ message_id });
  if (!message) return;

  const currentIndex = statusOrder.indexOf(message.status);
  const newIndex = statusOrder.indexOf(newStatus);

  if (newIndex > currentIndex) {
    message.status = newStatus;
    await message.save();
  }
};
