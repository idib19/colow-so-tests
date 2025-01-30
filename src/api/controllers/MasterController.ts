import { Request, Response } from 'express';
import { MasterService } from '../../application/services/MasterService';         
import { CreateTransactionDTO , CreateCardLoadDTO , CreateTransferDTO} from '../../application/dtos';
import { TransactionValidator } from '../../application/validators/transactionValidator';


export class MasterController {
  private service: MasterService;

  constructor() {
    this.service = new MasterService();
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

 

  getTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await this.service.getAllMasterTransactions(req.params.masterId);
      
      if (!transactions || (Array.isArray(transactions) && transactions.length === 0)) {
        return res.status(404).json({ message: 'No transactions found' });
      }

      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get transactions' });
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

  createTransfer = async (req: Request, res: Response) => {
    try {
      const transferData: CreateTransferDTO = req.body;

      // Validate required fields
      if (!transferData ||
          typeof transferData.issuerId !== 'string' ||
          !transferData.type ||
          ![1, 2].includes(transferData.type) ||
          typeof transferData.amount !== 'number' ||
          transferData.amount <= 0 ||
          !Number.isFinite(transferData.amount)) {
        return res.status(400).json({
          error: 'Invalid transfer data. Required fields: issuerId (string), type (1|2), amount (positive number)'
        });
      }

      const transfer = await this.service.createTransfer(transferData);
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
      if (error instanceof Error && error.message === 'Unauthorized request') {
        return res.status(404).json({ error: 'Master not found' });
      }
      res.status(500).json({ error: 'Failed to get balance' });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.service.getMetricsV2(req.params.masterId);
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