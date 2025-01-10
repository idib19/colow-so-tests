import { IMasterService } from '../interfaces/IMasterService';
import { Master } from '../../domain/entities/Master';
import { Transaction } from '../../domain/entities/Transaction';
import { CardLoad } from '../../domain/entities/CardLoad';
import { Transfer } from '../../domain/entities/Transfer';
import { getTransactionsByIssuerId, calculateTotalTransactionAmount } from '../../domain/functions/transactionFunctions';
import { getTransfersByIssuerId, calculateTotalTransferAmount } from '../../domain/functions/transferFunctions';
import { getCardLoadsByIssuerId, calculateTotalCardLoadAmount } from '../../domain/functions/cardLoadFunctions';
import { Partner } from '../../domain/entities/Partner';
import { CreatePartnerDTO } from '../dtos/partner/PartnerDTO';

export class MasterService implements IMasterService {
  
  async createTransaction(transactionData: any) {
    // First get the master and check balance
    const master = await Master.findById(transactionData.issuerId);
    if (!master) {
      throw new Error('Master not found');
    }

    // Check if master has sufficient balance
    if (master.balance < transactionData.amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction
    const transaction = new Transaction({
      ...transactionData,
      issuerModel: 'Master'
    });

    // Use a session to ensure atomicity
    const session = await Transaction.startSession();
    try {
      session.startTransaction();

      // Save the transaction
      await transaction.save({ session });

      // Update master's balance
      await Master.findByIdAndUpdate(
        master.id,
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



  async getAllMasterTransactions(masterId: string) {
    const transactions = await Transaction.find({issuerId : masterId});
    return transactions;
  }


  async loadCard(cardLoadData: any) {
    // First get the master and check balance
    const master = await Master.findById(cardLoadData.issuerId);
    if (!master) {
      throw new Error('Master not found');
    }

    // Check if master has sufficient balance
    if (master.balance < cardLoadData.amount) {
      throw new Error('Insufficient balance');
    }

    // Create card load
    const cardLoad = new CardLoad({
      ...cardLoadData,
      issuerModel: 'Master'
    });

    // Use a session to ensure atomicity
    const session = await CardLoad.startSession();
    try {
      session.startTransaction();
      await cardLoad.save({ session });
      await Master.findByIdAndUpdate(
        master.id,
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

  async createTransfer(transferData: any) {
    const transfer = new Transfer(transferData);
    return transfer.save();
  }

  async getBalance(masterId: string) {
    const master = await Master.findById(masterId);
    if (!master) {
      throw new Error('Unauthorized request');
    }
    return master.balance ;
  }

  async getMetrics(masterId: string) {
    const [
      transactions,
      totalTransactionAmount,
      transfers,
      totalTransferAmount,
      cardLoads,
      totalCardLoadAmount
    ] = await Promise.all([
      getTransactionsByIssuerId(masterId),
      calculateTotalTransactionAmount(masterId),
      getTransfersByIssuerId(masterId),
      calculateTotalTransferAmount(masterId),
      getCardLoadsByIssuerId(masterId),
      calculateTotalCardLoadAmount(masterId)
    ]);

    return {
      transactionCount: transactions.length,
      totalTransactionAmount,
      transferCount: transfers.length,
      totalTransferAmount,
      cardLoadCount: cardLoads.length,
      totalCardLoadAmount
    };
  }

  async createPartner(partnerData: CreatePartnerDTO) {
    const partner = new Partner({
      ...partnerData,
      masterId: partnerData.masterId,
      userId: partnerData.userId,
      country: partnerData.country,
      balance: 0,
      totalCommission: 0
    });
    return partner.save();
  }

  async getPartners(masterId: string) {
    const master = await Master.findById(masterId).populate('partnersList');
    return master?.partnersList || [];
  }
}