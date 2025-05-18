import { calculateUserBalance } from "../services/user.js";


export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
      await calculateUserBalance(req.user._id);
    } catch (err) {
      next(err);
    }
  };
};
