import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/transactions.js';
import createHttpError from 'http-errors';

export const getTransactionsController = async (req, res) => {
  const userId = req.user._id;
  const transactions = await getAllTransactions({userId});
console.log(req.user.balance);
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
};

export const deleteTransactionController = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const transaction = await deleteTransaction(transactionId, userId);

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(204).send();
};

export const upsertTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  const { transaction, isNew } = await updateTransaction(transactionId, userId, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(status).json({
    status,
    message: 'Sucessfully update a transaction',
    data: transaction,
  });
};
