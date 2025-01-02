import { MasterService } from '../../../application/services/MasterService';
import { Master } from '../../../domain/entities/Master';
import { Transaction } from '../../../domain/entities/Transaction';
import mongoose from 'mongoose';

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(() => {
    service = new MasterService();
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const masterId = new mongoose.Types.ObjectId();
      const transactionData = {
        issuerId: masterId.toString(),
        issuerModel: 'Master' as const,
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
      expect(transaction.issuerModel).toBe('Master');
    });
  });

  describe('getBalance', () => {
    it('should return master balance', async () => {
      const master = await Master.create({
        country: 'TestCountry',
        balance: 1000
      });

      const balance = await service.getBalance(master._id.toString());
      expect(balance).toBe(1000);
    });
  });
});