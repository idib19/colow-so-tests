import { CreateTransactionDTO } from '../../application/dtos';

export class TransactionValidator {
  static validateTransaction(data: any): data is CreateTransactionDTO {
    return (
      data &&
      typeof data.issuerId === 'string' &&
      typeof data.issuerModel === 'string' &&
      ['Master', 'Partner'].includes(data.issuerModel) &&
      typeof data.amount === 'number' &&
      data.amount > 0 &&
      this.validatePersonInfo(data.senderInfo) &&
      this.validatePersonInfo(data.receiverInfo)
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
