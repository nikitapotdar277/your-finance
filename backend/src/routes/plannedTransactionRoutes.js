import { Router } from 'express';
import {
  listPlannedTransactions,
  createPlannedTransaction,
  updatePlannedTransaction,
  deletePlannedTransaction,
} from '../controllers/plannedTransactionController.js';
import { validatePlannedTransactionPayload } from '../middleware/validatePlannedTransaction.js';

const router = Router();

router.get('/', listPlannedTransactions);
router.post('/', validatePlannedTransactionPayload, createPlannedTransaction);
router.put('/:id', validatePlannedTransactionPayload, updatePlannedTransaction);
router.delete('/:id', deletePlannedTransaction);

export default router;
