import { IPartnerService } from '../interfaces/IPartnerService';
import { Partner } from '../../domain/entities/Partner';
import { Transaction } from '../../domain/entities/Transaction';
import { CardLoad } from '../../domain/entities/CardLoad';
import { getTransactionsByIssuerId, calculateTotalTransactionAmount } from '../../domain/functions/transactionFunctions';
import { getCardLoadsByIssuerId, calculateTotalCardLoadAmount } from '../../domain/functions/cardLoadFunctions';

export class PartnerService implements IPartnerService {
  async createTransaction(transactionData: any) {
    const transaction = new Transaction({
      ...transactionData,
      issuerModel: 'Partner'
    });
    return transaction.save();
  }

  async loadCard(cardLoadData: any) {
    const cardLoad = new CardLoad({
      ...cardLoadData,
      issuerModel: 'Partner'
    });
    return cardLoad.save();
  }

  async getBalance(partnerId: string) {
    const partner = await Partner.findById(partnerId);
    return partner?.balance || 0;
  }

  async getMetrics(partnerId: string) {
    const [
      transactions,
      totalTransactionAmount,
      cardLoads,
      totalCardLoadAmount
    ] = await Promise.all([
      getTransactionsByIssuerId(partnerId),
      calculateTotalTransactionAmount(partnerId),
      getCardLoadsByIssuerId(partnerId),
      calculateTotalCardLoadAmount(partnerId)
    ]);

    return {
      transactionCount: transactions.length,
      totalTransactionAmount,
      cardLoadCount: cardLoads.length,
      totalCardLoadAmount
    };
  }
}