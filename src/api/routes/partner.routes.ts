import { Router } from 'express';
import { PartnerController } from '../controllers/PartnerController';

const router = Router();
const controller = new PartnerController();

router.post('/transaction', controller.createTransaction);
router.get('/balance/:partnerId', controller.getBalance);
router.post('/card-load', controller.loadCard);
router.get('/metrics', controller.getMetrics);

export default router;