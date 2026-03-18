import { Router } from 'express';
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { validateTransactionPayload } from '../middleware/validateTransaction.js';

const router = Router();

router.get('/', listTransactions);
router.post('/', validateTransactionPayload, createTransaction);
router.put('/:id', validateTransactionPayload, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
