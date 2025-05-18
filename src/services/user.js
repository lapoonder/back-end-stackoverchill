import { UsersCollection } from '../db/models/auth.js';
import { TransactionsCollection } from '../db/models/transaction.js';

export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId);

  return user;
};

export const calculateUserBalance = async (userId) => {
  const transactions = await TransactionsCollection.find({ userId });

  const newBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

  return await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { balance: newBalance.toFixed(2) },
    {
      new: true,
      includeResultMetadata: true,
    },
  );
};
