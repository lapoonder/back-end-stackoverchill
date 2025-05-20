import { UsersCollection } from '../db/models/auth.js';

export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId);

  return user;
};


export const updateBalance = async (newBalance, userId) => {
  const rawResult = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { balance: newBalance.toFixed(2) },
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value.balance;
};
