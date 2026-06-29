import { Router } from 'express';
import * as itemController from '../controllers/itemController';
import { authenticateToken } from '../middleware/auth';
import { validateItem } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Item CRUD routes
router.post('/lists/:listId/items', validateItem, itemController.addItem);
router.put('/items/:id', validateItem, itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

// Item action routes
router.post('/items/:id/reserve', itemController.reserveItem);
router.post('/items/:id/donate', itemController.donateItem);
router.post('/items/:id/takeback', itemController.takebackItem);

export default router;
