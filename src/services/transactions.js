import { UsersCollection } from '../db/models/auth.js';
import { CategoriesCollection } from '../db/models/category.js';
import { TransactionsCollection } from '../db/models/transaction.js';
import { updateBalance } from './user.js';

export const getAllTransactions = ({ userId }) =>
  TransactionsCollection.find({ userId });

export const getTransactionById = (id, userId) => TransactionsCollection.findOne({ _id: id, userId })

export const createTransaction = async (payload, userId, balance) => {
    const transaction = await TransactionsCollection.create({
      userId,
      ...payload,
    });

  const newBalance = transaction.type === 'income' ? balance + transaction.amount : balance - transaction.amount

  const updatedBalance = await updateBalance(newBalance, userId);

  return { transaction, balance: updatedBalance };
}

export const deleteTransaction = async (contactId, userId, balance) => {
  const transaction = await TransactionsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

    const newBalance =
      transaction.type === 'income'
        ? balance - transaction.amount
        : balance + transaction.amount;

  const updatedBalance = await updateBalance(newBalance, userId);
  return {transaction, balance: updatedBalance};
};

export const updateTransaction = async (transactionId, userId, balance, payload, options = {}) => {

   const transaction = await TransactionsCollection.findOne({
     _id: transactionId,
     userId,
   });

  const rawResult = await TransactionsCollection.findOneAndUpdate(
    { _id: transactionId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

    if (!rawResult || !rawResult.value) return null;

  if (payload.amount !== transaction.amount) {
    const diffrence = payload.amount - transaction.amount;
    const newBalance =
      rawResult.value.type === 'income'
        ? balance + diffrence
        : balance - diffrence;

      const updatedBalance = await updateBalance(newBalance, userId);

  return {
    transaction: rawResult.value,
    balance: updatedBalance,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
  }

  return {
    transaction: rawResult.value,
    balance,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
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

  //вибираємо всі транзакції користувача за період
  const transactions = await TransactionsCollection.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    userId,
  })
    .select('type categoryId amount')
    .lean();

  //вибираємо всі категорії
  const categories = await CategoriesCollection.find()
    .select('-createdAt -updatedAt')
    .lean();

  //підраховуємо загальну сумму транзакцій по кожній категорії
  categories.map((category) => {
    category.sum = transactions.reduce(
      (total, transaction) =>
        transaction.categoryId.toString() === category._id.toString()
          ? total + transaction.amount
          : total,
      0,
    );
  });

  //Вибираємо в новий обєкт суми транзакцій по типу expense
  const expense = categories
    .filter((category) => category.type === 'expense')
    .map(({ name, sum }) => ({ name, sum }));

  //Вибираємо в новий обєкт суми транзакцій по типу income
  const income = categories
    .filter((category) => category.type === 'income')
    .map(({ name, sum }) => ({ name, sum }));

  //Підраховуємо загальну сумму по кожному типу транзакції
  const totalExpense = expense.reduce((total, transaction) => {
    return total + transaction.sum;
  }, 0);
  const totalIncome = income.reduce((total, transaction) => {
    return total + transaction.sum;
  }, 0);

  return {
    expense,
    income,
    totalExpense,
    totalIncome,
  };
};
