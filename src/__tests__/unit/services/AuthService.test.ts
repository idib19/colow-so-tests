import { AuthService } from '../../../application/services/AuthService';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MasterRegistrationDTO, RegistrationDTO } from '../../../application/dtos/auth/RegisterDTO';
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
    
    // Properly mock bcrypt.compare
    (bcrypt.compare as jest.Mock).mockReset();
    
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
      const mockUser = {
        id: '1',
        username: 'test',
        isActive: true,
        password: 'hashedPassword',
        name: 'Test User',
        email: 'test@test.com',
        role: 'master',
        entityId: 'entity1'
      };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser as any);

      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        console.log('bcrypt.compare was called');
        return Promise.resolve(false);
      });

      const result = await authService.login('test', 'wrongpassword');

      console.log('Mock calls:', mockUserRepository.findByUsername.mock.calls);
      console.log('Result:', result);
      
      expect(result).toBeNull();

    });

    it('should return token and user data for valid credentials', async () => {
      // First create a user
      const registrationData : MasterRegistrationDTO = {
        username: 'test',
        password: 'password123',
        email: 'test@test.com',
        role: 'master',
        name: 'Test User',
        entityId: 'no-entity-assigned'
      };

      // Mock bcrypt hash for registration
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Mock user creation
      const mockUser = {
        id: '1',
        ...registrationData,
        password: 'hashedPassword',
        entityId: 'no-entity-assigned',
        isActive: true,
      };
      mockUserRepository.create.mockResolvedValue(mockUser as any);

      // Register the user
      const user = await authService.registerMaster(registrationData);

      console.log("User created:", user);
      // Now test login
      mockUserRepository.findByUsername.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login('test', 'password123');

      expect(result).toEqual({
        token: 'mockToken',
        user: {
          id: '1',
          username: 'test',
          email: 'test@test.com',
          role: 'master'
        }
      });

      // Verify that both create and findByUsername were called
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('test');
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

      const hashedPassword = 'password123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockCreatedUser = {
        id: '1',
        ...userData,
        password: hashedPassword,
        role: 'master',
        entityId: 'no-entity-assigned',
        isActive: true
      };

      mockUserRepository.create.mockResolvedValue(mockCreatedUser as any);

      const result = await authService.registerMaster(userData as MasterRegistrationDTO);

      expect(result).toEqual({ user: mockCreatedUser });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        role: 'master',
        entityId: 'no-entity-assigned'
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