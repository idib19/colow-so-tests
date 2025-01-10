import { AuthService } from '../../../application/services/AuthService';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MasterRegistrationDTO, RegistrationDTO } from '../../../application/dtos/auth/RegisterDTO';
import { IUser } from '../../../domain/entities/User';
// Mock the UserRepository
jest.mock('../../../infrastructure/repositories/UserRepository');
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

      const result = await authService.login({ username: 'nonexistent', password: 'password' });

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

      const result = await authService.login({ username: 'test', password: 'password' });

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const plainPassword = 'correctpassword';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockUser = {
        id: '1',
        username: 'test',
        isActive: true,
        password: hashedPassword,
        name: 'Test User',
        email: 'test@test.com',
        role: 'master',
        entityId: 'entity1'
      };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser as any);

      const result = await authService.login({ 
        username: 'test', 
        password: 'wrongpassword'  // Different from plainPassword
      });

      expect(result).toBeNull();
    });

    it('should return token and user data for valid credentials', async () => {
      const plainPassword = 'password123';
      // Now this will work - using real bcrypt
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockUser = {
        id: '1',
        username: 'test',
        password: hashedPassword,  // Using real hashed password
        email: 'test@test.com',
        role: 'master',
        name: 'Test User',
        entityId: 'no-entity-assigned',
        isActive: true
      };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser as IUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login({
        username: 'test',
        password: plainPassword  // Use the plain password - bcrypt.compare will work for real
      });



      expect(result?.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        name: mockUser.name,
        entityId: mockUser.entityId
      });
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

      // Use real bcrypt
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Update mockCreatedUser to match the actual structure
      const mockCreatedUser = {
        ...userData,
        password: hashedPassword,
        role: 'master',
        isActive: true
      };

      mockUserRepository.create.mockResolvedValue(mockCreatedUser as any);

      const result = await authService.registerMaster(userData as MasterRegistrationDTO);

      expect(result).toEqual({ user: mockCreatedUser });


    });
  });

  describe('changePassword', () => {
    it('should return false for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await authService.changePassword('1', 'old', 'new');

      expect(result).toBeFalsy();
    });

    it('should return false for invalid old password', async () => {
      const oldPassword = 'correctpassword';
      const hashedOldPassword = await bcrypt.hash(oldPassword, 10);

      mockUserRepository.findById.mockResolvedValue({
        id: '1',
        password: hashedOldPassword
      } as any);

      const result = await authService.changePassword('1', 'wrongpassword', 'new');

      expect(result).toBeFalsy();
    });

    it('should update password successfully', async () => {
      const oldPassword = 'correctpassword';
      const hashedOldPassword = await bcrypt.hash(oldPassword, 10);

      mockUserRepository.findById.mockResolvedValue({
        id: '1',
        password: hashedOldPassword
      } as any);

      const result = await authService.changePassword('1', oldPassword, 'newpassword');

      expect(result).toBeTruthy();
      // Verify that update was called with a hashed version of the new password
      expect(mockUserRepository.update).toHaveBeenCalled();
      const updateCall = mockUserRepository.update.mock.calls[0];
      expect(updateCall[0]).toBe('1');
      // Verify the password was hashed (starts with bcrypt identifier)
      expect(updateCall[1].password).toMatch(/^\$2b\$\d+\$/);
    });
  });
}); 