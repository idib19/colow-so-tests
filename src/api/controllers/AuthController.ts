import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { MasterRegistrationDTO, PartnerRegistrationDTO } from '../../application/dtos/auth/RegisterDTO';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const result = await this.authService.login(username, password);
      
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  };

  // Todo : make sure to receive the correct userData and that this action is operated by admin only ! 
  registerMaster = async (req: AuthRequest, res: Response) => {
    try {
      const registrationData: MasterRegistrationDTO = req.body;
      
      if (!this.validateMasterRegistration(registrationData)) {
        return res.status(400).json({ 
          message: 'Invalid registration data',
          details: 'Missing required fields' 
        });
      }

      const result = await this.authService.registerMaster(registrationData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Register master error:', error);
      if (error instanceof Error) {
        res.status(500).json({ 
          message: 'Registration failed',
          details: error.message 
        });
      } else {
        res.status(500).json({ message: 'Registration failed' });
      }
    }
  };

  registerPartner = async (req: AuthRequest, res: Response) => {
    try {
      // Get the master user from the authenticated request
      const masterId = req.user?.id;
      const masterRole = req.user?.role;

      // Verify master privileges
      if (!masterId || masterRole !== 'master') {
        return res.status(403).json({ 
          message: 'Only master accounts can register partners' 
        });
      }

      const registrationData: PartnerRegistrationDTO = req.body;
      
      // Validate registration data
      if (!this.validatePartnerRegistration(registrationData)) {
        return res.status(400).json({ 
          message: 'Invalid registration data' 
        });
      }

      // Ensure the master can only create partners for themselves
      if (registrationData.masterId !== masterId) {
        return res.status(403).json({ 
          message: 'Cannot create partners for other masters' 
        });
      }

      const result = await this.authService.registerPartner(
        registrationData,
      );

      res.status(201).json(result);
    } catch (error) {
      console.error('Register partner error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  };

  changePassword = async (req: AuthRequest, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.id; // From auth middleware

      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing required data' });
      }

      const success = await this.authService.changePassword(userId, oldPassword, newPassword);
      
      if (!success) {
        return res.status(400).json({ message: 'Invalid old password' });
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Password change failed' });
    }
  };

  private validateMasterRegistration(data: MasterRegistrationDTO): boolean {
    return !!(
      data.username &&
      data.password &&
      data.email
    );
  }

  private validatePartnerRegistration(data: PartnerRegistrationDTO): boolean {
    return !!(
      data.username &&
      data.password &&
      data.email &&
      data.masterId
    );
  }
} 