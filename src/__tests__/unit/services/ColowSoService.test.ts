import { ColowSoService } from '../../../application/services/ColowSoService';
import { Master } from '../../../domain/entities/Master';
import { Transaction } from '../../../domain/entities/Transaction';
import mongoose from 'mongoose';

describe('ColowSoService', () => {
  let service: ColowSoService;

  beforeEach(() => {
    service = new ColowSoService();
  });

  describe('loadMasterAccount', () => {
    it('should load master account with specified amount', async () => {
      const master = await Master.create({
        country: 'TestCountry',
        balance: 0
      });

      await service.loadMasterAccount(master._id.toString(), 1000);

      const updatedMaster = await Master.findById(master._id);
      expect(updatedMaster?.balance).toBe(1000);
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const master = await Master.create({ country: 'TestCountry' });
      
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

      const transactions = await service.getAllTransactions();
      expect(transactions).toHaveLength(2);
    });
  });
});