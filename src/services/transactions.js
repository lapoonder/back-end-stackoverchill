import { UsersCollection } from '../db/models/auth.js';
import { TransactionsCollection } from '../db/models/transaction.js';
import createHttpError from 'http-errors';

export const getAllTransactions = ({ userId }) =>
  TransactionsCollection.find({ userId });

export const getTransactionById = (id) => TransactionsCollection.findById(id);


export const createTransaction = async (payload, userId) => {
    const transaction = await TransactionsCollection.create({
      userId,
      ...payload,
    });

    return transaction;
}

export const deleteTransaction = async (contactId, userId) => {
  const transaction = await TransactionsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return transaction;
};

export const updateTransaction = async (transactionId, userId, payload, options = {}) => {

  const rawResult = await TransactionsCollection.findOneAndUpdate(
    { _id: transactionId,
    userId},
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    transaction: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};


