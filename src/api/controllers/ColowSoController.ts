import { Request, Response } from 'express';
import { ColowSoService } from '../../application/services/ColowSoService';
import { CreateMasterDTO } from '../../application/dtos';
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
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate the data
      if (!masterData || typeof masterData.country !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid master data',
          details: 'Country is required and must be a string'
        });
      }

      // Create the master
      const result = await this.service.createMaster(masterData, userId);
      console.log('Master created successfully:', result);

      res.status(201).json({ 
        message: 'Master created successfully',
        data: result 
      });
    } catch (error) {
      // Detailed error logging
      console.error('Failed to create master:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestBody: req.body
      });

      res.status(500).json({ 
        error: 'Failed to create master',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

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
      res.json(masters );
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