import request from 'supertest';
import { app } from '../setup';
import { Master } from '../../domain/entities/Master';
import { createTestMaster, createTestTransaction } from '../helpers/testHelpers';
import { generateTestToken } from '../helpers/auth.helper';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('ColowSo API Endpoints', () => {
  let adminColowsoToken: string;

  beforeAll(() => {
    // Generate token with proper admin ID and entityId
    adminColowsoToken = generateTestToken(
      'admin-colowso',
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString()
    );
  });

  beforeAll(async () => {
    // Log the token and decoded contents
    console.log('Admin token:', adminColowsoToken);
    // If using jwt, you can decode and log the payload
    console.log('Token payload:', jwt.decode(adminColowsoToken));
  });

  describe('POST /api/colowso/load-master', () => {
    it('should load master account', async () => {
      const master = await createTestMaster();
      const loadData = {
        masterId: master._id,
        amount: 1000
      };

      const response = await request(app)
        .post('/api/colowso/load-master')
        .set('Authorization', `Bearer ${adminColowsoToken}`)
        .send(loadData)
        .expect(200);

      expect(response.body.message).toBe('Master account loaded successfully');

      const updatedMaster = await Master.findById(master._id);
      expect(updatedMaster?.balance).toBe(1000);
    });
  });

  describe('GET /api/colowso/transactions', () => {
    it('should return all transactions', async () => {
      const master = await createTestMaster();
      await createTestTransaction(master.id, 'Master', 100);
      await createTestTransaction(master.id, 'Master', 200);

      const response = await request(app)
        .get('/api/colowso/transactions')
        .set('Authorization', `Bearer ${adminColowsoToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
    });
  });
});