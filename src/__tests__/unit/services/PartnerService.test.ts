import { PartnerService } from '../../../application/services/PartnerService';
import { Partner } from '../../../domain/entities/Partner';
import { Master } from '../../../domain/entities/Master';
import { createTestPartner, createTestMaster } from '../../helpers/testHelpers';

describe('PartnerService', () => {
  let service: PartnerService;
  let master: any;
  let partner: any;
  
  beforeEach(async () => {
    service = new PartnerService();
    master = await createTestMaster();
    partner = await createTestPartner(master._id.toString() , 'TestCountry', 500);
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
  

      const transactionData = {
        issuerId: partner.id.toString(),
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