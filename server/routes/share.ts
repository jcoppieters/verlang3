import { Router } from 'express';
import * as shareController from '../controllers/shareController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Search route (requires authentication) - must be before /:encodedId
router.get('/search', authenticateToken, shareController.search);

// Public routes (no authentication required)
router.get('/:encodedId', shareController.getSharedList);
router.post('/:encodedItemId/donate', shareController.donateFromShare);

export default router;
