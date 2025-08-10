// backend/controllers/conversationController.js
import Message from '../models/Message.js';

/**
 * Get all conversations grouped by wa_id
 * Returns: wa_id, name, last_message, last_timestamp
 */
export const getAllConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            {
                $sort: { timestamp: -1 } // Sort newest first
            },
            {
                $group: {
                    _id: '$wa_id',
                    name: { $first: '$name' },
                    last_message: { $first: '$text' },
                    last_timestamp: { $first: '$timestamp' },
                    last_status: { $first: '$status' }
                }
            },
            {
                $sort: { last_timestamp: -1 } // Sort conversations by latest activity
            }
        ]);

        res.json({ success: true, conversations });
    } catch (error) {
        console.error('❌ Get conversations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
