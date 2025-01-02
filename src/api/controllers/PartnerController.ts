import { Request, Response } from 'express';
import { PartnerService } from '../../application/services/PartnerService';

export class PartnerController {
  private service: PartnerService;

  constructor() {
    this.service = new PartnerService();
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

  getBalance = async (req: Request, res: Response) => {
    try {
      const balance = await this.service.getBalance(req.params.partnerId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get balance' });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.service.getMetrics(req.params.partnerId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  };
}