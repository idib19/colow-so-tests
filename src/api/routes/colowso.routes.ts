import { Router } from 'express';
import { ColowSoController } from '../controllers/ColowSoController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ColowSoController();

// Protect all ColowSo routes with admin-colowso role
router.use(authMiddleware(['admin-colowso']));

// Master management
router.post('/create-master', controller.createMasterAccount);
router.post('/load-master', controller.loadMasterAccount);

// Data retrieval
router.get('/transactions', controller.getAllTransactions);
router.get('/transfers', controller.getAllTransfers);
router.get('/claims', controller.getAllClaims);
router.get('/masters', controller.getMastersData);
router.get('/partners', controller.getPartnersData);
router.get('/card-loads', controller.getAllCardLoads);

export default router;