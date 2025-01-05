import { AuthService } from '../../../application/services/AuthService';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegistrationDTO } from '../../../application/dtos/auth/RegisterDTO';
// Mock the UserRepository
jest.mock('../../../infrastructure/repositories/UserRepository');
// Mock bcrypt
jest.mock('bcrypt');
// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of AuthService
    authService = new AuthService();
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    (authService as any).userRepository = mockUserRepository;
  });

  describe('login', () => {
    it('should return null for non-existent user', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      const result = await authService.login('nonexistent', 'password');

      expect(result).toBeNull();
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('should return null for inactive user', async () => {
      mockUserRepository.findByUsername.mockResolvedValue({
        id: '1',
        username: 'test',
        isActive: false,
        password: 'hashedPassword',
      } as any);

      const result = await authService.login('test', 'password');

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      mockUserRepository.findByUsername.mockResolvedValue({
        id: '1',
        username: 'test',
        isActive: true,
        password: 'hashedPassword',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login('test', 'wrongpassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });

    it('should return token and user data for valid credentials', async () => {
      const mockUser = {
        id: '1',
        username: 'test',
        name: 'Test User',
        email: 'test@test.com',
        role: 'master',
        entityId: 'entity1',
        isActive: true,
        password: 'hashedPassword',
      };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login('test', 'password');

      expect(result).toEqual({
        token: 'mockToken',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'master'
        }
      });
    });
  });

  describe('registerMaster', () => {
    it('should create a master user successfully', async () => {
      const userData = {
        username: 'testmaster',
        password: 'password123',
        email: 'master@test.com',
        role: 'master'
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockCreatedUser = {
        id: '1',
        ...userData,
        password: hashedPassword,
        role: 'master',
        entityId: 'non-assigned-entity',
        isActive: true
      };

      mockUserRepository.create.mockResolvedValue(mockCreatedUser as any);

      const result = await authService.registerMaster(userData as RegistrationDTO, 'adminId');

      expect(result).toEqual({ user: mockCreatedUser });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        role: 'master',
        entityId: 'non-assigned-entity'
      });
    });
  });

  describe('changePassword', () => {
    it('should return false for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await authService.changePassword('1', 'old', 'new');

      expect(result).toBeFalsy();
    });

    it('should return false for invalid old password', async () => {
      mockUserRepository.findById.mockResolvedValue({
        id: '1',
        password: 'hashedOldPassword'
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.changePassword('1', 'wrongold', 'new');

      expect(result).toBeFalsy();
    });

    it('should update password successfully', async () => {
      mockUserRepository.findById.mockResolvedValue({
        id: '1',
        password: 'hashedOldPassword'
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');

      const result = await authService.changePassword('1', 'old', 'new');

      expect(result).toBeTruthy();
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: 'hashedNewPassword'
      });
    });
  });
}); 