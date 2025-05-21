import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  date: Joi.date().iso().required(),
  amount: Joi.number().min(0.01).max(1000000).required(),
  comment: Joi.string().min(2).max(192),
  categoryId: Joi.string().required(),
});

export const updateTransactionSchema = Joi.object({
  date: Joi.date().iso(),
  amount: Joi.number().min(0.01).max(1000000),
  comment: Joi.string().min(2).max(192),
  categoryId: Joi.string().required(),
});
