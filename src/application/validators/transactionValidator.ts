import { CreateTransactionDTO } from '../../application/dtos';

export class TransactionValidator {
  static validateTransaction(data: any): data is CreateTransactionDTO {
    return (
      this.validateStructure(data) &&
      this.validateAmount(data.amount) &&
      this.validatePersonInfo(data.senderInfo) &&
      this.validatePersonInfo(data.receiverInfo)
    );
  }

  private static validateStructure(data: any): boolean {
    return (
      data &&
      typeof data.issuerId === 'string' &&
      typeof data.issuerModel === 'string' &&
      ['Master', 'Partner'].includes(data.issuerModel)
    );
  }

  private static validateAmount(amount: any): boolean {
    return (
      typeof amount === 'number' &&
      amount > 0 &&
      Number.isFinite(amount)
    );
  }

  private static validatePersonInfo(info: any): boolean {
    return (
      info &&
      typeof info.firstname === 'string' &&
      typeof info.lastname === 'string' &&
      typeof info.idCardNumber === 'string' &&
      typeof info.city === 'string' &&
      typeof info.phoneNumber === 'string' &&
      this.isValidEmail(info.email) &&
      typeof info.reason === 'string'
    );
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
  }
}
