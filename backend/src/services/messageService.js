// src/services/messageService.js
import Message from '../models/Message.js';

/**
 * Get all conversations grouped by wa_id
 */
export const getConversations = async () => {
  const conversations = await Message.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$wa_id',
        name: { $first: '$name' },
        lastMessage: { $first: '$text' },
        lastTimestamp: { $first: '$timestamp' },
        lastStatus: { $first: '$status' },
      },
    },
    { $sort: { lastTimestamp: -1 } },
  ]);
  return conversations;
};

/**
 * Get all messages for a specific wa_id
 */
export const getMessagesByWaId = async (wa_id) => {
  return await Message.find({ wa_id }).sort({ timestamp: 1 });
};
