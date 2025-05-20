import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().iso().required(),
  amount: Joi.number().min(0.01).max(1000000).required(),
  comment: Joi.string().min(2).max(192),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
  categoryId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').forbidden(),
  date: Joi.date().iso(),
  amount: Joi.number().min(0.01).max(1000000),
  comment: Joi.string().min(2).max(192),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
  categoryId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid mongo id');
    }
    return true;
  }),
});
