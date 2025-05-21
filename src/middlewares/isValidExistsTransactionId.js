import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
import { TransactionsCollection } from '../db/models/transaction.js';

export const isValidExistsTransactionId = async (req, res, next) => {
  const { transactionId } = req.params;
  if (!transactionId) return next();
  if (!isValidObjectId(transactionId)) {
    return next(createHttpError(400, `This id: ${transactionId} is not valid`));
  }
  const exists = await TransactionsCollection.exists({ _id: transactionId });
  if (!exists) {
    return next(createHttpError(404, `Id: ${transactionId} not found`));
  }
  next();
};
