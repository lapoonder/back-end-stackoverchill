import createHttpError from 'http-errors';
import { getCategoriesById } from '../services/categories.js';
import { CategoriesCollection } from '../db/models/category.js';
import { TransactionsCollection } from '../db/models/transaction.js';
import { updateBalance } from './user.js';
import mongoose from 'mongoose';

// export const getAllTransactions = ({ userId }) =>
//   TransactionsCollection.find({ userId });

export const getAllTransactions = async ({ userId }) => {
  return TransactionsCollection.aggregate([
    {
      $match: { userId },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $project: {
        userId: 1,
        categoryId: 1,
        date: 1,
        amount: 1,
        comment: 1,
        'category.name': 1,
        'category.type': 1,
      },
    },
  ]);
};

// export const getTransactionById = (id, userId) =>
//   TransactionsCollection.findOne({ _id: id, userId });

export const getTransactionById = async (id, userId) => {
  const [transaction] = await TransactionsCollection.aggregate([
    {
      $match: {
        _id: typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id,
        userId,
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $project: {
        userId: 1,
        categoryId: 1,
        date: 1,
        amount: 1,
        comment: 1,
        'category.name': 1,
        'category.type': 1,
      },
    },
  ]);

  return transaction || null;
};

export const createTransaction = async (payload, userId, balance, type) => {
  const transaction = await TransactionsCollection.create({
    userId,
    ...payload,
  });

  const newBalance =
    type === 'income'
      ? balance + transaction.amount
      : balance - transaction.amount;

  const updatedBalance = await updateBalance(newBalance, userId);

  const category = await getCategoriesById(payload.categoryId);
  const result = {
    _id: transaction._id,
    userId: transaction.userId,
    categoryId: transaction.categoryId,
    date: transaction.date.toISOString().split('T')[0],
    amount: transaction.amount,
    comment: transaction.comment,
    category: {
      name: category.name,
      type: category.type,
    },
  };

  return { transaction: result, balance: updatedBalance };
};

export const deleteTransaction = async (transactionId, userId, balance) => {
  const transaction = await TransactionsCollection.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  const category = await getCategoriesById(transaction?.categoryId);
  const newBalance =
    category === 'income'
      ? balance - transaction.amount
      : balance + transaction.amount;

  const updatedBalance = await updateBalance(newBalance, userId);
  return { transaction, balance: updatedBalance };
};

export const updateTransaction = async (
  transactionId,
  userId,
  balance,
  payload,
  options = {},
) => {
  const transaction = await TransactionsCollection.findOne({
    _id: transactionId,
    userId,
  });

  const [newCategory, oldCategory] = await Promise.all([
    getCategoriesById(payload.categoryId),
    getCategoriesById(transaction?.categoryId),
  ]);

  if (newCategory !== oldCategory) {
    throw createHttpError(
      400,
      'The new transaction category type is different from the existing one!',
    );
  }

  const updatedTransaction = await TransactionsCollection.findOneAndUpdate(
    { _id: transactionId, userId },
    payload,
    {
      new: true,
      ...options,
    },
  ).populate({
    path: 'categoryId',
    select: 'name type',
  });

  if (!updatedTransaction) return null;

  const result = {
    _id: updatedTransaction._id,
    userId: updatedTransaction.userId,
    categoryId: updatedTransaction.categoryId._id,
    date: updatedTransaction.date.toISOString().split('T')[0],
    amount: updatedTransaction.amount,
    comment: updatedTransaction.comment,
    category: {
      name: updatedTransaction.categoryId.name,
      type: updatedTransaction.categoryId.type,
    },
  };

  let updatedBalance = balance;
  if (payload.amount !== transaction.amount) {
    const diffrence = transaction.amount - payload.amount;
    updatedBalance =
      newCategory === 'income' ? balance - diffrence : balance + diffrence;

    updatedBalance = await updateBalance(updatedBalance, userId);
  }

  return {
    transaction: result,
    balance: updatedBalance,
  };
};

export const getSummary = async (period, userId) => {
  //Перевіряємо дату
  const isValidPeriod = /^\d{4}-(0[1-9]|1[0-2])$/.test(period);

  if (!isValidPeriod) {
    throw createHttpError(
      400,
      `Invalid period format '${period}'. Expected 'YYYY-MM'!`,
    );
  }

  //формуємо період дат, за який потрібна інформація
  const startDate = new Date(Date.parse(period));
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1);

  const categories = await CategoriesCollection.find()
    .select('name type')
    .lean();

  // Уникальные типы категорий
  const categoryTypes = [...new Set(categories.map((cat) => cat.type))];

  // Динамически создаём summaryMap по всем типам
  const summaryMap = {};
  categoryTypes.forEach((type) => {
    summaryMap[type] = new Map();
  });

  // Получаем транзакции пользователя за период
  const transactions = await TransactionsCollection.find({
    date: { $gte: startDate, $lte: endDate },
    userId,
  })
    .populate({
      path: 'categoryId',
      select: 'name type',
    })
    .select('categoryId amount')
    .lean();

  for (const transaction of transactions) {
    const category = transaction.categoryId;
    if (!category?.type) continue;

    const type = category.type;
    const name = category.name;
    const amount = transaction.amount;

    const currentSum = summaryMap[type].get(name) || 0;
    summaryMap[type].set(name, currentSum + amount);
  }

  const result = {};
  for (const type of categoryTypes) {
    result[type] = categories
      .filter((cat) => cat.type === type)
      .map(({ name }) => ({
        name,
        sum: summaryMap[type].get(name) || 0,
      }));
  }

  for (const type of categoryTypes) {
    result[`total${type[0].toUpperCase()}${type.slice(1)}`] = result[
      type
    ].reduce((total, item) => total + item.sum, 0);
  }

  return result;
};
