import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getSummaryController } from '../controllers/transactions.js';

const router = Router();

router.use(authenticate);

router.get('/:period', checkUser(), ctrlWrapper(getSummaryController));

export default router;
