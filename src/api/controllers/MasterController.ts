import { Request, Response } from 'express';
import { MasterService } from '../../application/services/MasterService';         

export class MasterController {
  private service: MasterService;

  constructor() {
    this.service = new MasterService();
  }

  createTransaction = async (req: Request, res: Response) => {
    try {
      const transaction = await this.service.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  };

  loadCard = async (req: Request, res: Response) => {
    try {
      const cardLoad = await this.service.loadCard(req.body);
      res.status(201).json(cardLoad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load card' });
    }
  };

  createTransfer = async (req: Request, res: Response) => {
    try {
      const transfer = await this.service.createTransfer(req.body);
      res.status(201).json(transfer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transfer' });
    }
  };

  getBalance = async (req: Request, res: Response) => {
    try {
      const balance = await this.service.getBalance(req.params.masterId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get balance' });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.service.getMetrics(req.params.masterId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  };

  getPartners = async (req: Request, res: Response) => {
    try {
      const partners = await this.service.getPartners(req.params.masterId);
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get partners' });
    }
  };
}