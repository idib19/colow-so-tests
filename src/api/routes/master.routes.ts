import { Router } from 'express';
import { MasterController } from '../controllers/MasterController';

const router = Router();
const controller = new MasterController();

// Actions / POST type routes
router.post('/card-load', controller.loadCard);
router.post('/transfer', controller.createTransfer);
router.post('/transaction', controller.createTransaction);







// Queries / GET type routes
router.get('/transaction/:masterId', controller.getTransactions);
router.get('/balance/:masterId', controller.getBalance);
router.get('/metrics/:masterId', controller.getMetrics);
router.get('/partners', controller.getPartners);
router.get('/card-loads/:masterId', controller.getCardLoads);
export default router;