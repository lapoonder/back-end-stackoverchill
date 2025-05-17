import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getTransactionsController,
  getTransactionsByIdController,
  createTransactionController,
  deleteTransactionController,
  upsertTransactionController,
  patchTransactionController,
} from '../controllers/transactions.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validation/transactions.js';

const router = Router();

router.use(authenticate);

router.get('/', checkUser(), ctrlWrapper(getTransactionsController));

router.get(
  '/:transactionId',
  checkUser(),
  isValidId,
  ctrlWrapper(getTransactionsByIdController),
);

router.post(
  '/',
  checkUser(),
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);

router.delete(
  '/:transactionId',
  checkUser(),
  isValidId,
  ctrlWrapper(deleteTransactionController),
);

router.put(
  '/:transactionId',
  checkUser(),
  isValidId,
  validateBody(createTransactionSchema),
  ctrlWrapper(upsertTransactionController),
);

router.patch(
  '/:transactionId',
  checkUser(),
  isValidId,
  validateBody(updateTransactionSchema),
  ctrlWrapper(patchTransactionController),
);

export default router;
