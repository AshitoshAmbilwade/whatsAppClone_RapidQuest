import {
  getConversationsService,
  getMessagesByWaId,
  searchMessagesService,
  markMessagesAsReadService,
  getMessagesByWaIdWithFilters,
  createMessageService
} from '../services/messageService.js';
import { searchValidation } from '../validations/messageValidation.js';

// GET /api/messages/conversations
export const listConversations = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, q = '' } = req.query;

    const conversations = await getConversationsService({
      limit: Number(limit),
      skip: Number(skip),
      search: q
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/:wa_id
export const listMessages = async (req, res, next) => {
  try {
    const messages = await getMessagesByWaId(req.params.wa_id);
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/:wa_id/filter
export const listMessagesWithFilters = async (req, res, next) => {
  try {
    const { status, type, from, to, limit, skip } = req.query;
    const { wa_id } = req.params;

    const messages = await getMessagesByWaIdWithFilters({
      wa_id,
      status,
      type,
      from,
      to,
      limit: Number(limit) || 20,
      skip: Number(skip) || 0
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/search
export const searchMessages = async (req, res, next) => {
  try {
    const { error, value } = searchValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { q, limit, skip } = value;
    const results = await searchMessagesService({
      query: q,
      limit: Number(limit) || 20,
      skip: Number(skip) || 0
    });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:wa_id/read
// PATCH /api/messages/:wa_id/read
export const markMessagesAsRead = async (req, res, next) => {
  try {
    const { wa_id } = req.params;
    const io = req.app.get('io');

    const result = await markMessagesAsReadService(wa_id);

    if (io) {
      // ✅ Emit to only the relevant rooms instead of global
      io.to(`conversation_${wa_id}`).emit('message_status_update', {
        message_id: null, // or loop through the updated messages
        status: 'read'
      });
      io.to(`user_${wa_id}`).emit('message_status_update', {
        message_id: null,
        status: 'read'
      });
    }

    res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/messages
// in controllers/messageController.js (createMessage)
export const createMessage = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const newMessage = await createMessageService(req.body);

    // Emit to the conversation room only
    if (io) {
      io.to(`conversation_${newMessage.wa_id}`).emit('new_message', newMessage);
      // also notify conversation list change (everyone)
      io.emit('conversation_updated', {
        wa_id: newMessage.wa_id,
        last_message: newMessage.text,
        last_timestamp: newMessage.timestamp
      });
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};
