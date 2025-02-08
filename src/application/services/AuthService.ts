import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../domain/entities/User';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { MasterUserRegistrationDTO, PartnerUserRegistrationDTO } from '../dtos/auth/RegisterDTO';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    entityId: string;
  };
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private generateToken(user: IUser) {
    return jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        entityId: user.entityId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  }

  async login(loginData: { username: string, password: string }): Promise<LoginResponse | null> {


    const user = await this.validateCredentials(loginData.username, loginData.password);


    if (!user) {
      return null;
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId
      }
    };
  }

  private async validateCredentials(username: string, password: string): Promise<IUser | null> {
    

    const user = await this.userRepository.findByUsername(username);


    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    await this.userRepository.updateLastLogin(user.id);
    return user;
  }

  async registerMaster(userData: MasterUserRegistrationDTO) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userRepository.create(new User({
        ...userData,
        username: userData.name,
        password: hashedPassword,
        role: 'master',
        isActive: true
      }));

      console.log("user created service: ", user);

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create master: ${error.message}`);
      }
      throw error;
    }
  }

  async registerPartner(userData: PartnerUserRegistrationDTO) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userRepository.create(new User({
        ...userData,
        password: hashedPassword,
        role: 'partner',
        isActive: true
      }));

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create partner: ${error.message}`);
      }
      throw error;
    }
  }

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

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }
} 