import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getUserByIdController } from '../controllers/user.js';


const router = Router();

router.use(authenticate);

router.get(
  '/',
  checkUser(),
  ctrlWrapper(getUserByIdController),
);

export default router;
