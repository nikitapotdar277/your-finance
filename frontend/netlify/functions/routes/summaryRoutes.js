import { Router } from 'express';
import { getMonthlySummary } from '../controllers/summaryController.js';

const router = Router();

router.get('/', getMonthlySummary);

export default router;
