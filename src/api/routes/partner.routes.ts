import { Router } from 'express';
import { PartnerController } from '../controllers/partner.controller';

const router = Router();
const controller = new PartnerController();

router.post('/transaction', controller.createTransaction);
router.post('/card-load', controller.loadCard);
router.get('/balance', controller.getBalance);
router.get('/metrics', controller.getMetrics);

export default router;