import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getSummary,
} from '../services/transactions.js';
import createHttpError from 'http-errors';
import { calculateUserBalance } from '../services/user.js';

export const getTransactionsController = async (req, res) => {
  const userId = req.user._id;
  const transactions = await getAllTransactions({ userId });

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    data: transactions,
  });
};

export const getTransactionsByIdController = async (req, res, next) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const transaction = await getTransactionById(transactionId, userId);

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found transaction with id ${transactionId}!`,
    data: transaction,
  });
};

export const createTransactionController = async (req, res) => {
  const userId = req.user._id;
  const transaction = await createTransaction(req.body, userId);

  res.status(201).json({
    status: 201,
    message: `Successfully created a transaction!`,
    data: transaction,
  });

  await calculateUserBalance(req.user._id);
};

export const patchTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const result = await updateTransaction(transactionId, userId, req.body);

  if (!result) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a transaction!`,
    data: result,
  });

  await calculateUserBalance(req.user._id);
};

export const deleteTransactionController = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const transaction = await deleteTransaction(transactionId, userId);

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(204).send();

  await calculateUserBalance(req.user._id);
};

export const upsertTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const { transaction, isNew } = await updateTransaction(
    transactionId,
    userId,
    req.body,
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(status).json({
    status,
    message: 'Sucessfully update a transaction',
    data: transaction,
  });

  await calculateUserBalance(req.user._id);
};

export const getSummaryController = async (req, res, next) => {
  const { period } = req.params;
  const userId = req.user._id;

  const { expense, income, totalExpense, totalIncome } = await getSummary(
    period,
    userId,
  );

  res.status(200).json({
    status: 200,
    message: `Successfully found summary!`,
    data: {
      expense,
      income,
      totalExpense,
      totalIncome,
    },
  });
};
