import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const userId = req.user._id;
  if (!isValidObjectId(userId)) {
    throw createHttpError(400, 'This userID does not exist!');
  }
  next();
};
