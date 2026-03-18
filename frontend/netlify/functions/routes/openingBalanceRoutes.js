import { Router } from 'express';
import { listOpeningBalances, upsertOpeningBalance } from '../controllers/openingBalanceController.js';

const router = Router();

router.get('/', listOpeningBalances);
router.put('/', upsertOpeningBalance);

export default router;
