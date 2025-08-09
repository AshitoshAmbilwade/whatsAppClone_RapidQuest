// src/validations/messageValidation.js

import Joi from 'joi';

export const searchValidation = Joi.object({
  q: Joi.string().min(1).required().messages({
    'string.empty': 'Search query cannot be empty',
    'any.required': 'Search query is required'
  }),
  limit: Joi.number().min(1).max(100).optional(),
  skip: Joi.number().min(0).optional()
});
