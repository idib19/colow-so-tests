import { Request, Response } from 'express';
import { ColowSoService } from '../../application/services/ColowSoService';

export class ColowSoController {
  private service: ColowSoService;

  constructor() {
    this.service = new ColowSoService();
  }

  loadMasterAccount = async (req: Request, res: Response) => {
    try {

      await this.service.loadMasterAccount(req.body.masterId, req.body.amount);

      res.status(200).json({ message: 'Master account loaded successfully' });
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to load master account' });
    }
  };

  getAllTransactions = async (_req: Request, res: Response) => {
    try {
      const transactions = await this.service.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  };

  getAllTransfers = async (_req: Request, res: Response) => {
    try {
      const transfers = await this.service.getAllTransfers();
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get transfers' });
    }
  };

  getAllClaims = async (_req: Request, res: Response) => {
    try {
      const claims = await this.service.getAllClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get claims' });
    }
  };

  getMastersData = async (_req: Request, res: Response) => {
    try {
      const masters = await this.service.getMastersData();
      res.json(masters);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get masters data' });
    }
  };

  getPartnersData = async (_req: Request, res: Response) => {
    try {
      const partners = await this.service.getPartnersData();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get partners data' });
    }
  };

  getAllCardLoads = async (_req: Request, res: Response) => {
    try {
      const cardLoads = await this.service.getAllCardLoads();
      res.json(cardLoads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get card loads' });
    }
  };
}