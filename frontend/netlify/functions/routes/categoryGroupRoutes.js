import { Router } from 'express';
import { listCategoryGroups, getCategoryGroup } from '../controllers/categoryGroupController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listCategoryGroups);
router.get('/:id', requireAuth, getCategoryGroup);

export default router;