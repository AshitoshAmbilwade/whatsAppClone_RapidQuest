import { getConversationsService, getMessagesByWaId,searchMessagesService,markMessagesAsReadService } from '../services/messageService.js';
import { searchValidation } from '../validations/messageValidation.js';

export const listConversations = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, q = '' } = req.query;

    const conversations = await getConversationsService({
      limit,
      skip,
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

export const listMessages = async (req, res, next) => {
  try {
    const messages = await getMessagesByWaId(req.params.wa_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const searchMessages = async (req, res, next) => {
  try {
    // Validate query params
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

export const markMessagesAsRead = async (req, res, next) => {
  try {
    const { wa_id } = req.params;
    const io = req.app.get('io'); // for real-time

    const result = await markMessagesAsReadService(wa_id);

    // Emit real-time update
    io.emit('messages_read', { wa_id });

    res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};