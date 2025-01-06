import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { MasterRegistrationDTO, PartnerRegistrationDTO } from '../dtos/auth/RegisterDTO';
import { Types } from 'mongoose';
import { IUser, UserModel } from '../../infrastructure/database/models/UserModel';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

 
  private generateToken(user: { id: string; role: string; entityId: string }) {
    return jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        entityId: user.entityId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  }

  async login(username: string, password: string): Promise<LoginResponse | null> {
    const user = await this.validateCredentials(username, password);
    
    if (!user) {
      return null;
    }

    const token = this.generateToken({
      id: user.id,
      role: user.role,
      entityId: user.entityId.toString()
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

   // validate password and username used by login
   private async validateCredentials(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    await this.userRepository.updateLastLogin(user.id);
    return user;
  }

  async registerMaster(userData: MasterRegistrationDTO) {
    try {
      // 1. Create the master entity first

      // 2. Create the user account
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userRepository.create({
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        name: userData.name,
        role: 'master',
        entityId: userData.entityId,
        isActive: true
      });

      return { 
        user, 
      };
    } catch (error) {
      // If master creation fails, throw error with details
      if (error instanceof Error) {
        throw new Error(`Failed to create master: ${error.message}`);
      }
      throw error;
    }
  }

  async registerPartner(userData: PartnerRegistrationDTO) {
    try {
      // 1. Create the partner entity first
 

      // 2. Create the user account
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userRepository.create({
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        name: userData.name,
        entityId: userData.entityId,
        role: 'partner',
        isActive: true
      });

      return { 
        user,
      };
    } catch (error) {
      // If partner creation fails, throw error with details
      if (error instanceof Error) {
        throw new Error(`Failed to create partner: ${error.message}`);
      }
      throw error;
    }
  }

  // change password service for user
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isPasswordValid) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
    
    return true;
  }
} 