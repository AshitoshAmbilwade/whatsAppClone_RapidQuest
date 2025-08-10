// backend/controllers/conversationController.js
import Message from '../models/Message.js';

/**
 * Get all conversations for the logged-in user, grouped by contact wa_id
 */
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          last_message: { $first: '$text' },
          last_timestamp: { $first: '$timestamp' },
          last_status: { $first: '$status' },
          direction: { $first: '$direction' }
        }
      },
      { $sort: { last_timestamp: -1 } }
    ]);

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};