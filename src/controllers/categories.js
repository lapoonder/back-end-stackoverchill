import { getCategoriesByType } from '../services/categories.js';
import createHttpError from 'http-errors';

export const getCategoriesByTypeController = async (req, res) => {
  const { type } = req.params;
  const listCategories = await getCategoriesByType(type);

  if (!listCategories) {
    throw createHttpError(404, 'Information of categories for type not found');
  }

  res.json({
    status: 200,
    message: `List of categories for ${type}`,
    data: listCategories,
  });
};
