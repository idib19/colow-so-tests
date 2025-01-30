import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/users', authMiddleware(['admin-colowso']), authController.getAllUsers);
router.post('/register/master', authMiddleware(['admin-colowso']), authController.registerUserMaster);
router.post('/register/partner', authMiddleware(['master', 'admin-colowso']), authController.registerUserPartner);
router.post('/change-password', authMiddleware(['master', 'partner', 'admin-colowso']), authController.changePassword);



export default router; 