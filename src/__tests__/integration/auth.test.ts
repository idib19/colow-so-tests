import request from 'supertest';
import { app } from '../setup';
import { UserModel } from '../../infrastructure/database/models/UserModel';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

describe('Auth Integration Tests', () => {

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await UserModel.create({
        username: 'testuser',
        password: hashedPassword,
        email: 'test@test.com',
        name: 'Test User',
        role: 'master',
        entityId: 'not-assigned',
        isActive: true
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@test.com');
      expect(response.body.user).toHaveProperty('role', 'master');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
























  describe('POST /api/auth/register/master', () => {
    let adminToken: string;

    beforeEach(async () => {
      // Create an admin user and get token
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await UserModel.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin-colowso',
        entityId: new mongoose.Types.ObjectId(),
        isActive: true
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      adminToken = loginResponse.body.token;
    });

    it('should register a master successfully with admin token', async () => {
      const response = await request(app)
        .post('/api/auth/register/master')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'newmaster',
          password: 'master123',
          email: 'master@test.com',
          name: 'New Master'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('role', 'master');
    });

    it('should fail registration without admin token', async () => {
      const response = await request(app)
        .post('/api/auth/register/master')
        .send({
          username: 'newmaster',
          password: 'master123',
          email: 'master@test.com',
          name: 'New Master'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/change-password', () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a test user and get token
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await UserModel.create({
        username: 'testuser',
        password: hashedPassword,
        email: 'test@test.com',
        name: 'Test User',
        role: 'master',
        entityId: new mongoose.Types.ObjectId(),
        isActive: true
      });

      userId = user.id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      userToken = loginResponse.body.token;
    });

    it('should change password successfully', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          oldPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password updated successfully');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
    });

    it('should fail with incorrect old password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid old password');
    });
  });
}); 