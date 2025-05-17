import Joi from 'joi';

export const CategorySchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
});
