import { Router } from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import categoriesRouter from './categories.js';
import transactionsRouter from './transactions.js';
import summaryRouter from './summary.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoriesRouter);
router.use('/transactions', transactionsRouter);

// При работе с категориями в transaction вызывать getCategoriesById из файла ../services/categories.js
// передавать ИД в виде строки. Например await getCategoriesById('65ca67e7ae7f10c88b59837d');

router.use('/summary', summaryRouter);

export default router;
