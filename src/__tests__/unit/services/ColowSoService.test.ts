import { ColowSoService } from '../../../application/services/ColowSoService';
import { Master } from '../../../domain/entities/Master';
import { createTestMaster } from '../../helpers/testHelpers';

describe('ColowSoService', () => {
  let service: ColowSoService;

  beforeEach(() => {
    service = new ColowSoService();
  });

  describe('createAndLoadMasterAccount', () => {
    it('should create and load master account with specified amount', async () => {
      // Create a master account
      const master = await createTestMaster();

      // Check if the master account is created
      expect(master).toBeDefined();

      // Load the master account with specified amount
      await service.loadMasterAccount(master._id.toString(), 1000 );

      // Check if the master account is updated
      const updatedMaster = await Master.findById(master._id);
    
      // Check if the master account is updated
      expect(updatedMaster?.balance).toBe(1000);
    });
  });


});