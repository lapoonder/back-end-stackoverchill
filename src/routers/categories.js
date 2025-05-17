import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateParams } from '../middlewares/validateParams.js';
import { getCategoriesByTypeController } from '../controllers/categories.js';
import { CategorySchema } from '../validation/categories.js';

const router = Router();

router.use(authenticate);

router.get(
  '/:type',
  validateParams(CategorySchema),
  checkUser(),
  ctrlWrapper(getCategoriesByTypeController),
);

export default router;
