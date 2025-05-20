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


