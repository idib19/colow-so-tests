import request from 'supertest';
import { app } from '../setup';
import { Master } from '../../domain/entities/Master';
import { createTestMaster, createTestTransaction } from '../helpers/testHelpers';


describe('ColowSo API Endpoints', () => {
  describe('POST /api/colowso/load-master', () => {
    it('should load master account', async () => {
      const master = await createTestMaster();

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
      const master = await createTestMaster();
      
      // Create test transactions
      await createTestTransaction(master.id, 'Master', 100);
      await createTestTransaction(master.id, 'Master', 200);

       
      const response = await request(app)
        .get('/api/colowso/transactions')
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
    });
  });
});