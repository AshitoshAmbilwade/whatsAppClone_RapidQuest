import { getConversations, getMessagesByWaId } from '../services/messageService.js';

export const listConversations = async (req, res, next) => {
  try {
    const conversations = await getConversations();
    res.json(conversations);
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
