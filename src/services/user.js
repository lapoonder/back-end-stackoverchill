import { UsersCollection } from '../db/models/auth.js';
export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId);
  return user;
};
