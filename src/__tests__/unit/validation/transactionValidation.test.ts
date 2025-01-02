import { validateTransaction } from '../../../application/validation/transactionValidation';
import { CreateTransactionDTO } from '../../../application/dtos';

describe('Transaction Validation', () => {
  const validTransaction: CreateTransactionDTO = {
    issuerId: '507f1f77bcf86cd799439011',
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

  it('should pass validation for valid transaction', () => {
    const result = validateTransaction(validTransaction);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation for missing required fields', () => {
    const invalidTransaction = {
      ...validTransaction,
      senderInfo: undefined
    };

    const result = validateTransaction(invalidTransaction);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('senderInfo is required');
  });

  it('should validate email format', () => {
    const invalidTransaction = {
      ...validTransaction,
      senderInfo: {
        ...validTransaction.senderInfo,
        email: 'invalid-email'
      }
    };

    const result = validateTransaction(invalidTransaction);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });

  it('should validate phone number format', () => {
    const invalidTransaction = {
      ...validTransaction,
      senderInfo: {
        ...validTransaction.senderInfo,
        phoneNumber: '123'  // Too short
      }
    };

    const result = validateTransaction(invalidTransaction);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid phone number format');
  });

  it('should validate amount is positive', () => {
    const invalidTransaction = {
      ...validTransaction,
      amount: -100
    };

    const result = validateTransaction(invalidTransaction);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Amount must be positive');
  });
});