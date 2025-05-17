import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  deleteCategoryController,
  upsertCategoryController,
  patchCategoryController,
} from '../controllers/categories.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validation/categories.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.use(authenticate);

router.get('/', checkUser(), ctrlWrapper(getCategoriesController));

router.get(
  '/:categoryId',
  checkUser(),
  isValidId,
  ctrlWrapper(getCategoryByIdController),
);

router.post(
  '/',
  checkUser(),
  validateBody(createCategorySchema),
  ctrlWrapper(createCategoryController),
);

router.delete(
  '/:categoryId',
  checkUser(),
  isValidId,
  ctrlWrapper(deleteCategoryController),
);

router.put(
  '/:categoryId',
  checkUser(),
  isValidId,
  validateBody(createCategorySchema),
  ctrlWrapper(upsertCategoryController),
);

router.patch(
  '/:categoryId',
  checkUser(),
  isValidId,
  validateBody(updateCategorySchema),
  ctrlWrapper(patchCategoryController),
);

export default router;
