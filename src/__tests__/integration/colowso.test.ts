import request from 'supertest';
import { app } from '../../index';
import { Master } from '../../domain/entities/Master';
import { Transaction } from '../../domain/entities/Transaction';

describe('ColowSo API Endpoints', () => {
  describe('POST /api/colowso/load-master', () => {
    it('should load master account', async () => {
      const master = await Master.create({ country: 'TestCountry', balance: 0 });

      const loadData = {
        masterId: master._id,
        amount: 1000
      };

      const response = await request(app)
        .post('/api/colowso/load-master')
        .send(loadData)
        .expect(200);

      expect(response.body.message).toBe('Master account loaded successfully');

      const updatedMaster = await Master.findById(master._id);
      expect(updatedMaster?.balance).toBe(1000);
    });
  });

  describe('GET /api/colowso/transactions', () => {
    it('should return all transactions', async () => {
      const master = await Master.create({ country: 'TestCountry' });
      
      // Create test transactions
      await Transaction.create([
        {
          issuerId: master._id,
          issuerModel: 'Master',
          senderInfo: { name: 'Test1', contact: 'test1@example.com' },
          receiverInfo: { name: 'Test2', contact: 'test2@example.com' },
          amount: 100
        },
        {
          issuerId: master._id,
          issuerModel: 'Master',
          senderInfo: { name: 'Test3', contact: 'test3@example.com' },
          receiverInfo: { name: 'Test4', contact: 'test4@example.com' },
          amount: 200
        }
      ]);

      const response = await request(app)
        .get('/api/colowso/transactions')
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
    });
  });
});