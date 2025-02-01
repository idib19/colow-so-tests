import { Router } from 'express';
import { PartnerController } from '../controllers/PartnerController';

const router = Router();
const controller = new PartnerController();

// Actions / POST type routes
router.post('/card-load', controller.loadCard);
router.post('/transaction', controller.createTransaction);

// Queries / GET type routes
router.get('/balance/:partnerId', controller.getBalance);
router.get('/metrics', controller.getMetrics);
// get card loads history , claims history , create claim , 
export default router;