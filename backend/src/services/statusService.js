import Message from '../models/Message.js';

// Allowed progression order
const ORDER = ['sent', 'delivered', 'read'];

/**
 * Update a message's status if the new status is a progression
 * (never downgrades). Case-insensitive match.
 * @param {string} message_id - The WhatsApp message ID
 * @param {string} newStatus - The new status (sent|delivered|read)
 * @returns {Promise<Message|null>} Updated or existing message
 */
export const updateMessageStatus = async (message_id, newStatus) => {
  if (!message_id || !newStatus) return null;

  // Normalize to lowercase for comparison
  const normalizedStatus = String(newStatus).toLowerCase();

  if (!ORDER.includes(normalizedStatus)) {
    console.warn(`Ignoring unknown status: ${newStatus}`);
    return null;
  }

  const message = await Message.findOne({ message_id });
  if (!message) return null;

  const currentStatus = message.status?.toLowerCase() || 'sent';
  const curIndex = ORDER.indexOf(currentStatus);
  const newIndex = ORDER.indexOf(normalizedStatus);

  // Only update if new status is a progression
  if (newIndex > curIndex) {
    message.status = normalizedStatus;
    await message.save();
    return message;
  }

  return message; // unchanged
};
