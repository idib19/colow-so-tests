import { Router } from 'express';
import { ColowSoController } from '../controllers/colowso.controller';

const router = Router();
const controller = new ColowSoController();

router.post('/load-master', controller.loadMasterAccount);
router.get('/transactions', controller.getAllTransactions);
router.get('/transfers', controller.getAllTransfers);
router.get('/claims', controller.getAllClaims);
router.get('/masters', controller.getMastersData);
router.get('/partners', controller.getPartnersData);
router.get('/card-loads', controller.getAllCardLoads);

export default router;