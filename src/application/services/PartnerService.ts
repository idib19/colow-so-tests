import { IPartnerService } from '../interfaces/IPartnerService';
import { Partner } from '../../domain/entities/Partner';
import { Transaction } from '../../domain/entities/Transaction';
import { CardLoad } from '../../domain/entities/CardLoad';
import { getTransactionsByIssuerId, calculateTotalTransactionAmount } from '../../domain/functions/transactionFunctions';
import { getCardLoadsByIssuerId, calculateTotalCardLoadAmount } from '../../domain/functions/cardLoadFunctions';

export class PartnerService implements IPartnerService {
  async createTransaction(transactionData: any) {

    // First get the master and check balance
    const partner = await Partner.findById(transactionData.issuerId);
    if (!partner) {
      throw new Error('Partner not found');
    }

    // Check if partner has sufficient balance
    if (partner.balance < transactionData.amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction
    const transaction = new Transaction({
      ...transactionData,
      issuerModel: 'Partner'
    });

    // Use a session to ensure atomicity
    const session = await Transaction.startSession();
    try {
      session.startTransaction();

      // Save the transaction
      await transaction.save({ session });

      // Update partner's balance
      await Partner.findByIdAndUpdate(
        partner.id,
        { $inc: { balance: -transactionData.amount } },
        { session }
      );


      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }


  async getAllPartnerTransactions(partnerId: string) {
    const transactions = await Transaction.find({issuerId : partnerId});
    return transactions;
  }


  async loadCard(cardLoadData: any) {

    // First get the partner and check balance
    const partner = await Partner.findById(cardLoadData.issuerId);
    if (!partner) {
      throw new Error('Partner not found');
    }

    // Check if partner has sufficient balance
    if (partner.balance < cardLoadData.amount) {
      throw new Error('Insufficient balance');
    }

    // Create card load
    const cardLoad = new CardLoad({
      ...cardLoadData,
      issuerModel: 'Partner'
    });

    // Use a session to ensure atomicity
    const session = await CardLoad.startSession();
    try {
      session.startTransaction();
      await cardLoad.save({ session });
      await Partner.findByIdAndUpdate(
        partner.id,
        { $inc: { balance: cardLoadData.amount } },
        { session }
      );
      await session.commitTransaction();
      return cardLoad;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

