import { CategoriesCollection } from '../db/models/category.js';

export const getCategoriesByType = async (type) => {
  const categories = await CategoriesCollection.find({
    type: type,
  }).select('-createdAt -updatedAt');
  return categories;
};

// При работе с категориями в transaction вызывать getCategoriesById
// передавать ИД в виде строки. Например await getCategoriesById('65ca67e7ae7f10c88b59837d');

export const getCategoriesById = async (id) => {
  const category = await CategoriesCollection.findOne({
    _id: id,
  }).select('-createdAt -updatedAt');
  return category?.type;
};
