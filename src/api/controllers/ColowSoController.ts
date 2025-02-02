import { Request, Response } from 'express';
import { ColowSoService } from '../../application/services/ColowSoService';
import { CreateMasterDTO, CreateTransferDTO } from '../../application/dtos';
import { AuthRequest } from '../middleware/auth.middleware';

export class ColowSoController {
  private service: ColowSoService;

  constructor() {
    this.service = new ColowSoService();
  }

  // this function is to create a master account 
  // note that this is different from the master registration wich is creating a user of type master 
  // master account and user's are different entities linked by the entityId 
  createMasterAccount = async (req: AuthRequest, res: Response) => {
    try {
    
      const masterData: CreateMasterDTO = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized, need to be logged in' });
      }

      if (user.role !== 'admin-colowso') {
        return res.status(401).json({ error: 'Unauthorized, admin needed ' });
      }

      // Validate the data
      if (!masterData || typeof masterData.country !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid master data',
          details: 'Country is required and must be a string'
        });
      }

      // Create the master
      const result = await this.service.createMaster(masterData, user.id);

      res.status(201).json({ 
        message: 'Master account created successfully',
        data: result 
      });

    } catch (error) {
      // Detailed error logging
      console.error('Failed to create master:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestBody: req.body
      });

      res.status(500).json({ 
        error: 'Failed to create master',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  loadMasterAccount = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (user.role !== 'admin-colowso') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { receiverId, amount, issuerId, type } = req.body as CreateTransferDTO;

      if (!receiverId || !amount || !issuerId || !type) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      // issuerId should be equal to the user.id + this transfer should only be of type 1 
      if (issuerId !== user.id || type !== 1) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      await this.service.loadMasterAccount(receiverId, amount, issuerId, type);

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