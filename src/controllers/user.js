import { getUserById} from '../services/user.js';
import createHttpError from 'http-errors';

export const getUserByIdController = async (req, res) => {
  const userId = req.user._id.toString();
  const user = await getUserById(userId);

  if (!user) {
    throw createHttpError(404, 'Information of user not found');
  }

  res.json({
    status: 200,
    message: `Information about user`,
    data: user,
  });
};
