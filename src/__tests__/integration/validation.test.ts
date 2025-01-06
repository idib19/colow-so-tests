import request from 'supertest';
import { app } from '../setup';
import { createTestMaster, createTestPartner } from '../helpers/testHelpers';
import mongoose from 'mongoose';
import { generateTestToken } from '../helpers/auth.helper';

describe('API Validation Tests', () => {
  describe('Transaction Validation', () => {
    let masterId: string;

    beforeEach(async () => {
      const master = await createTestMaster();
      masterId = master._id.toString();
    });

    it('should validate required fields in transaction creation', async () => {
      const masterToken = generateTestToken('master');
      const incompleteData = {
        issuerId: masterId,
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/master/transaction')
        .send(incompleteData)
        .set('Authorization', `Bearer ${masterToken}`)
        .expect(400);

      expect(response.body.error).toBe('Invalid data.');
    });

    it('should validate amount is positive', async () => {
      const invalidData = {
        issuerId: masterId,
        issuerModel: 'Master',
        senderInfo: {
          firstname: 'John',
          lastname: 'Doe',
          idCardNumber: 'ID123',
          city: 'TestCity',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          reason: 'Test'
        },
        receiverInfo: {
          firstname: 'Jane',
          lastname: 'Doe',
          idCardNumber: 'ID456',
          city: 'TestCity',
          phoneNumber: '0987654321',
          email: 'jane@example.com',
          reason: 'Test'
        },
        amount: -100
      };

      const masterToken = generateTestToken('master');
      const response = await request(app)
        .post('/api/master/transaction')
        .send(invalidData)
        .set('Authorization', `Bearer ${masterToken}`)
        .expect(400);

      expect(response.body.error).toBe('Invalid data.');
    });

    it('should validate email format', async () => {
      const invalidData = {
        issuerId: masterId,
        issuerModel: 'Master',
        senderInfo: {
          firstname: 'John',
          lastname: 'Doe',
          idCardNumber: 'ID123',
          city: 'TestCity',
          phoneNumber: '1234567890',
          email: 'invalid-email',
          reason: 'Test'
        },
        receiverInfo: {
          firstname: 'Jane',
          lastname: 'Doe',
          idCardNumber: 'ID456',
          city: 'TestCity',
          phoneNumber: '0987654321',
          email: 'jane@example.com',
          reason: 'Test'
        },
        amount: 100
      };
      const masterToken = generateTestToken('master');
      const response = await request(app)
        .post('/api/master/transaction')
        .send(invalidData)
        .set('Authorization', `Bearer ${masterToken}`)  
        .expect(400);

      expect(response.body.error).toBe('Invalid data.');
    });
  });

  // describe('Error Handling', () => {
  //   it('should handle invalid MongoDB ObjectId', async () => {
  //     const invalidId = 'invalid-id';
      
  //     const response = await request(app)
  //       .get(`/api/master/balance/${invalidId}`)
  //       .expect(400);

  //     expect(response.body.error).toBe('Invalid ID format');
  //   });

  //   it('should handle database connection errors', async () => {
  //     // Simulate database connection error
  //     const originalConnect = mongoose.connect;
  //     mongoose.connect = jest.fn().mockRejectedValue(new Error('Database connection failed'));

  //     const response = await request(app)
  //       .get('/api/colowso/transactions')
  //       .expect(500);

  //     expect(response.body.error).toBe('Internal server error');

  //     // Restore original connect function
  //     mongoose.connect = originalConnect;
  //   });

  //   it('should handle concurrent requests gracefully', async () => {
  //     const master = await createTestMaster();
      
  //     // Make multiple concurrent requests
  //     const requests = Array(10).fill(null).map(() => 
  //       request(app)
  //         .post('/api/master/transaction')
  //         .send({
  //           issuerId: master._id,
  //           issuerModel: 'Master',
  //           senderInfo: {
  //             firstname: 'John',
  //             lastname: 'Doe',
  //             idCardNumber: 'ID123',
  //             city: 'TestCity',
  //             phoneNumber: '1234567890',
  //             email: 'john@example.com',
  //             reason: 'Test'
  //           },
  //           receiverInfo: {
  //             firstname: 'Jane',
  //             lastname: 'Doe',
  //             idCardNumber: 'ID456',
  //             city: 'TestCity',
  //             phoneNumber: '0987654321',
  //             email: 'jane@example.com',
  //             reason: 'Test'
  //           },
  //           amount: 100
  //         })
  //     );

  //     const responses = await Promise.all(requests);
  //     responses.forEach(response => {
  //       expect(response.status).toBe(201);
  //     });
  //   });
  // });
});