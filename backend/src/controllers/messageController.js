import { getConversationsService, getMessagesByWaId } from '../services/messageService.js';

export const listConversations = async (req, res, next) => {
  const { limit, skip, q } = req.query;

  const conversations = await getConversationsService({
    limit: limit || 20,
    skip: skip || 0,
    search: q || ''
  });

  res.status(200).json(conversations);
};

export const listMessages = async (req, res, next) => {
  try {
    const messages = await getMessagesByWaId(req.params.wa_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
