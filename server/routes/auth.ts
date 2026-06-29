import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.updatePassword);

export default router;
