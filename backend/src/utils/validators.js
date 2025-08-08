import Joi from 'joi';

export const payloadSchema = Joi.object({
  payload_type: Joi.string().required(),
  metaData: Joi.object().required(),
}).unknown(true); // allow extra fields

export const sendMessageSchema = Joi.object({
  wa_id: Joi.string().required(),
  text: Joi.string().required(),
  direction: Joi.string().valid('incoming', 'outgoing').default('outgoing')
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});