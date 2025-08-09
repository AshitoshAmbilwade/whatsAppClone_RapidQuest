import ProcessedMessage from '../models/Message.js';

// Get conversations grouped by wa_id
export const getConversationsService = async ({ limit = 20, skip = 0, search = '' }) => {
  const matchStage = {};
  if (search.trim()) {
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { wa_id: { $regex: search, $options: 'i' } }
    ];
  }

  return await ProcessedMessage.aggregate([
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
    { $skip: skip },
    { $limit: Math.min(limit, 100) }
  ]);
};

// Get messages for a conversation
export const getMessagesByWaId = async (wa_id) => {
  return await ProcessedMessage.find({ wa_id }).sort({ timestamp: 1 });
};

// Search messages globally
export const searchMessagesService = async ({ query, limit = 20, skip = 0 }) => {
  if (!query.trim()) return [];
  const regex = new RegExp(query, 'i');
  return await ProcessedMessage.find({
    $or: [{ text: regex }, { name: regex }, { wa_id: regex }]
  })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
};

// Mark messages as read
export const markMessagesAsReadService = async (wa_id) => {
  return await ProcessedMessage.updateMany(
    { wa_id, direction: 'incoming', status: { $in: ['sent', 'delivered'] } },
    { $set: { status: 'read' } }
  );
};

// Get messages with filters
export const getMessagesByWaIdWithFilters = async ({
  wa_id,
  status,
  type,
  from,
  to,
  limit = 20,
  skip = 0
}) => {
  const query = { wa_id };

  if (status) query.status = { $in: status.split(',') };
  if (type) query.type = { $in: type.split(',') };
  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);
  }

  return await ProcessedMessage.find(query)
    .sort({ timestamp: 1 })
    .skip(skip)
    .limit(limit);
};

// Create new message manually (Send Message demo)
export const createMessageService = async (payload) => {
  const { wa_id, name, text, type, direction } = payload;
  const newMsg = new ProcessedMessage({
    wa_id,
    name: name || 'Unknown',
    message_id: payload.message_id || `local-${Date.now()}`,
    direction: direction || 'outgoing',
    type: type || 'text',
    text,
    status: 'sent',
    timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
    raw_payload: payload,
    source: payload.source || 'manual'
  });
  return await newMsg.save();
};
