import { Router } from 'express';
import * as listController from '../controllers/listController';
import { authenticateToken } from '../middleware/auth';
import { validateList } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// List routes
router.get('/', listController.getAllLists);
router.get('/:id', listController.getList);
router.post('/', validateList, listController.createList);
router.put('/:id', validateList, listController.updateList);
router.delete('/:id', listController.deleteList);

// Follow routes
router.post('/:id/follow', listController.followList);
router.delete('/:id/follow', listController.unfollowList);

// Share route
router.post('/:id/share', listController.shareList);

export default router;
