// src/services/messageService.js
import Message from '../models/Message.js';

export const getConversationsService = async ({ limit = 20, skip = 0, search = '' }) => {
  const matchStage = {};

  if (search && search.trim() !== '') {
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { wa_id: { $regex: search, $options: 'i' } }
    ];
  }

  const conversations = await Message.aggregate([
    { $match: matchStage },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$wa_id',
        name: { $first: '$name' },
        last_message: { $first: '$text' },
        last_timestamp: { $first: '$timestamp' },
        last_message_type: { $first: '$type' },
        unread_count: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ['$status', ['sent', 'delivered']] },
                  { $eq: ['$direction', 'incoming'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    { $sort: { last_timestamp: -1 } },
    { $skip: Number(skip) },
    { $limit: Math.min(Number(limit), 100) } // Cap limit for performance
  ]);

  return conversations;
};

export const getMessagesByWaId = async (wa_id) => {
  return await Message.find({ wa_id: wa_id }).sort({ timestamp: -1 });
};

/**
 * Search messages by text, name, or wa_id
 * @param {string} query - Search term
 * @param {number} limit - Max results
 * @param {number} skip - Offset
 * @returns {Array} Matching messages
 */
export const searchMessagesService = async ({ query, limit = 20, skip = 0 }) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchRegex = new RegExp(query, 'i');

  const messages = await Message.find({
    $or: [
      { text: searchRegex },
      { name: searchRegex },
      { wa_id: searchRegex }
    ]
  })
    .sort({ timestamp: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  return messages;
};

// Mark all incoming messages for a contact as read

export const markMessagesAsReadService = async (wa_id) => {
  const result = await Message.updateMany(
    {
      wa_id,
      direction: 'incoming',
      status: { $in: ['sent', 'delivered'] }
    },
    { $set: { status: 'read' } }
  );
  return result;
};