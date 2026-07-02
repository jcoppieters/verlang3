import { Router } from 'express';
import * as shareController from '../controllers/shareController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Search route (requires authentication) - must be before /:encodedId
router.get('/search', authenticateToken, shareController.search);

// Follow a list via share link (requires authentication)
router.post('/:encodedId/follow', authenticateToken, shareController.followFromShare);

// Public routes (no authentication required)
router.get('/:encodedId', shareController.getSharedList);

export default router;
