import { PartnerService } from '../../../application/services/PartnerService';
import { Partner } from '../../../domain/entities/Partner';
import { Master } from '../../../domain/entities/Master';
import mongoose from 'mongoose';

describe('PartnerService', () => {
  let service: PartnerService;
  let master: any;

  beforeEach(async () => {
    service = new PartnerService();
    master = await Master.create({ country: 'TestCountry' });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const partner = await Partner.create({
        country: 'TestCountry',
        masterId: master._id
      });

      const transactionData = {
        issuerId: partner._id.toString(),
        issuerModel: 'Partner' as const,
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
        amount: 100
      };

      const transaction = await service.createTransaction(transactionData);
      
      expect(transaction).toBeDefined();
      expect(transaction.amount).toBe(100);
      expect(transaction.issuerModel).toBe('Partner');
    });
  });

  describe('getBalance', () => {
    it('should return partner balance', async () => {
      const partner = await Partner.create({
        country: 'TestCountry',
        masterId: master._id,
        balance: 500
      });

      const balance = await service.getBalance(partner._id.toString());
      expect(balance).toBe(500);
    });
  });
});