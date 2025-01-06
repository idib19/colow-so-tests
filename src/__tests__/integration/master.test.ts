import request from 'supertest';
import { app } from '../setup';
import { createTestMaster, createTestTransaction } from '../helpers/testHelpers';
import { CreateTransactionDTO } from '../../application/dtos';
import { generateTestToken } from '../helpers/auth.helper';

describe('Master API Endpoints', () => {
  let masterData: { _id: string; country: string; balance: number };
  const masterToken = generateTestToken('master');

  beforeEach(async () => {
    // Setup base test data
    const master = await createTestMaster('TestCountry', 1000);
    masterData = {
      _id: master.id.toString(),
      country: master.country,
      balance: master.balance
    };
  });

  // test for creating a transaction
  describe('POST /api/master/transaction', () => {
    it('should create a new transaction', async () => {
      const transactionData: CreateTransactionDTO = {
        issuerId: masterData._id,
        issuerModel: 'Master',
        senderInfo: {
          firstname: 'John',
          lastname: 'Doe',
          idCardNumber: 'ID123',
          city: 'TestCity',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          reason: 'Test transfer'
        },
        receiverInfo: {
          firstname: 'Jane',
          lastname: 'Doe',
          idCardNumber: 'ID456',
          city: 'TestCity',
          phoneNumber: '0987654321',
          email: 'jane@example.com',
          reason: 'Test receive'
        },
        amount: 100
      };

      const response = await request(app)
        .post('/api/master/transaction')
        .set('Authorization', `Bearer ${masterToken}`)
        .send(transactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        issuerId: masterData._id,
        amount: 100,
        issuerModel: 'Master'
      });
    });

    it('should return 400 for invalid transaction data', async () => {
      const invalidData = {
        issuerId: masterData._id,
        amount: -100 // Invalid amount
      };

      await request(app)
        .post('/api/master/transaction')
        .set('Authorization', `Bearer ${masterToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  // test for getting the balance of a master
  describe('GET /api/master/balance/:masterId', () => {

    it('should return master balance', async () => {
      const response = await request(app)
        .get(`/api/master/balance/${masterData._id}`)
        .set('Authorization', `Bearer ${masterToken}`)
        .expect(200);

      expect(response.body).toEqual({
        balance: masterData.balance
      });
    });

    it('should return 404 for non-existent master', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/api/master/balance/${nonExistentId}`)
        .set('Authorization', `Bearer ${masterToken}`)
        .expect(404);
    });
  });

  // test for getting the metrics of a master
  describe('GET /api/master/metrics/:masterId', () => {
    beforeEach(async () => {
      // Create test transactions for metrics
      await Promise.all([
        createTestTransaction(masterData._id, 'Master', 100),
        createTestTransaction(masterData._id, 'Master', 200)
      ]);
    });

    it('should return master metrics', async () => {
      const response = await request(app)
        .get(`/api/master/metrics/${masterData._id}`)
        .set('Authorization', `Bearer ${masterToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        transactionCount: 2,
        totalTransactionAmount: 300
      });
    });
  });


  it('should return 400 when amount exceeds master balance', async () => {

    const largeTransaction = createTestTransaction(masterData._id, 'Master', 2000);
    
    
    await request(app)
      .post('/api/master/transaction')
      .set('Authorization', `Bearer ${masterToken}`)
      .send(largeTransaction)
      .expect(400);
  });

});