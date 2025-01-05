import { Request, Response } from 'express';
import { PartnerService } from '../../application/services/PartnerService';
import { CreateCardLoadDTO, CreateTransactionDTO } from '../../application/dtos';
import { TransactionValidator } from '../../application/validators/transactionValidator';

export class PartnerController {
  private service: PartnerService;

  constructor() {
    this.service = new PartnerService();
  }

  createTransaction = async (req: Request, res: Response) => {
    try {
      const transactionData: CreateTransactionDTO = req.body;

      // Validate required fields
      if (!(TransactionValidator.validateTransaction(transactionData))) {
        return res.status(400).json({
          error: 'Invalid data.'
        });
      }
      const transaction = await this.service.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  };

  loadCard = async (req: Request, res: Response) => {
    try {
      const cardLoadData: CreateCardLoadDTO = req.body;

      // Validate required fields
      if (!cardLoadData ||
        typeof cardLoadData.issuerId !== 'string' ||
        typeof cardLoadData.cardId !== 'string' ||
        !['Master', 'Partner'].includes(cardLoadData.issuerModel) ||
        typeof cardLoadData.amount !== 'number' ||
        cardLoadData.amount <= 0 ||
        !Number.isFinite(cardLoadData.amount)) {
        return res.status(400).json({
          error: 'Invalid card load data. Required fields: issuerId (string), cardId (string), issuerModel (Master|Partner), amount (positive number)'
        });
      }
      const cardLoad = await this.service.loadCard(cardLoadData);
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