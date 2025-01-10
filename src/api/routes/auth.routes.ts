import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.post('/register/master', authMiddleware(['admin-colowso']), authController.registerMaster);
router.post('/register/partner', authMiddleware(['master', 'admin-colowso']), authController.registerPartner);
router.post('/change-password', authMiddleware(['master', 'partner', 'admin-colowso']), authController.changePassword);

export default router; 