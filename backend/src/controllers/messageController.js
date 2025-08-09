import { getConversationsService, getMessagesByWaId,searchMessagesService } from '../services/messageService.js';
import { searchValidation } from '../validations/messageValidation.js';
export const listConversations = async (req, res, next) => {
  try {
    const { limit, skip, q } = req.query;
    const conversations = await getConversationsService({
      limit: limit || 20,
      skip: skip || 0,
      search: q || ''
    });
    res.status(200).json(conversations);
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
    const { q, limit, skip } = req.query;

    const results = await searchMessagesService({
      query: q,
      limit: Number(limit) || 20,
      skip: Number(skip) || 0
    });

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};