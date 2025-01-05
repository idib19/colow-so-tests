import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RegistrationDTO } from '../dtos/auth/RegisterDTO';


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

  async registerMaster(userData: RegistrationDTO, adminId: string) {
    // Create user account of type master
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create master account
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'master',
      entityId: 'non-assigned-entity'
    });

    return { user };
  }

  async registerPartner(userData: RegistrationDTO) {
    // Create user account of type partner
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'partner',
      entityId: 'non-assigned-entity',
      isActive: true
    });

    return { user };
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