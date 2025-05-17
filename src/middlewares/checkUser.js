import createHttpError from 'http-errors';

export const checkUser = () => async (req, res, next) => {
  const { user } = req;
  if (!user) {
    next(createHttpError(401));
    return;
  }
  next();
};
