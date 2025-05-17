import { UsersCollection } from '../db/models/auth.js';
import { TransactionsCollection } from '../db/models/transaction.js';

export const getUserById = async (userId) => {
  const balance = await recalculateUserBalance(userId);
  const user = await UsersCollection.findById(userId);

  const cleanUser = user.toObject();

  return {...cleanUser, balance };
};

export const recalculateUserBalance = async (userId) => {
  const transactions = await TransactionsCollection.find({ userId });

  const newBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

return newBalance.toFixed(2)
};
