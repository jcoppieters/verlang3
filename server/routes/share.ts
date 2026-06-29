import { Router } from 'express';
import * as shareController from '../controllers/shareController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/:encodedId', shareController.getSharedList);
router.post('/:encodedItemId/donate', shareController.donateFromShare);

// Search route (requires authentication)
router.get('/search', authenticateToken, shareController.search);

export default router;
