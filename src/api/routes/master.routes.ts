import { Router } from 'express';
import { MasterController } from '../controllers/MasterController';

const router = Router();
const controller = new MasterController();

router.post('/transaction', controller.createTransaction);
router.get('/transaction/:masterId', controller.getTransactions);
router.post('/card-load', controller.loadCard);
router.post('/transfer', controller.createTransfer);
router.get('/balance/:masterId', controller.getBalance);
router.get('/metrics/:masterId', controller.getMetrics);
router.get('/partners', controller.getPartners);

export default router;