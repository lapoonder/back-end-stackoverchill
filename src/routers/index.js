import { Router } from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
// import categoriesRouter from './categories.js';
// import transactionsRouter from './transactions.js';
// import summaryRouter from './summary.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
// router.use('/categories', categoriesRouter);
// router.use('/transactions', transactionsRouter);
// router.use('/summary', summaryRouter);

export default router;
