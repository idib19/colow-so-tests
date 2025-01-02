import request from 'supertest';
import { app } from '../../index';
import { Partner } from '../../domain/entities/Partner';
import { Master } from '../../domain/entities/Master';

describe('Partner API Endpoints', () => {
  let master: any;

  beforeEach(async () => {
    master = await Master.create({ country: 'TestCountry' });
  });

  describe('POST /api/partner/transaction', () => {
    it('should create a new transaction', async () => {
      const partner = await Partner.create({
        country: 'TestCountry',
        masterId: master._id
      });

      const transactionData = {
        issuerId: partner._id,
        issuerModel: 'Partner',
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
        .post('/api/partner/transaction')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(100);
    });
  });

  describe('GET /api/partner/balance/:partnerId', () => {
    it('should return partner balance', async () => {
      const partner = await Partner.create({
        country: 'TestCountry',
        masterId: master._id,
        balance: 500
      });

      const response = await request(app)
        .get(`/api/partner/balance/${partner._id}`)
        .expect(200);

      expect(response.body.balance).toBe(500);
    });
  });
});