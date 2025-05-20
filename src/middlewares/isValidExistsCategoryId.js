import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
import { CategoriesCollection } from '../db/models/category.js';

export const isValidExistsCategoryId = async (req, res, next) => {
  const categoryId = req.body.categoryId;
  if (!categoryId) return next();
  if (!isValidObjectId(categoryId)) {
    return next(createHttpError(400, 'This id is not valid'));
  }
  const exists = await CategoriesCollection.exists({ _id: categoryId });
  if (!exists) {
    return next(createHttpError(404, `Id ${categoryId} not found`));
  }
  next();
};
