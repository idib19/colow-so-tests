import { Router } from 'express';
import { MasterController } from '../controllers/master.controller';

const router = Router();
const controller = new MasterController();

router.post('/transaction', controller.createTransaction);
router.post('/card-load', controller.loadCard);
router.post('/transfer', controller.createTransfer);
router.get('/balance', controller.getBalance);
router.get('/metrics', controller.getMetrics);
router.get('/partners', controller.getPartners);

export default router;