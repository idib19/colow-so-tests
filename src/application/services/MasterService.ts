import { IMasterService } from '../interfaces/IMasterService';
import { Master } from '../../domain/entities/Master';
import { Transaction } from '../../domain/entities/Transaction';
import { CardLoad } from '../../domain/entities/CardLoad';
import { Transfer } from '../../domain/entities/Transfer';
import { getTransactionsByIssuerId, calculateTotalTransactionAmount } from '../../domain/functions/transactionFunctions';
import { getTransfersByIssuerId, calculateTotalTransferAmount } from '../../domain/functions/transferFunctions';
import { getCardLoadsByIssuerId, calculateTotalCardLoadAmount } from '../../domain/functions/cardLoadFunctions';

export class MasterService implements IMasterService {
  async createTransaction(transactionData: any) {
    const transaction = new Transaction({
      ...transactionData,
      issuerModel: 'Master'
    });
    return transaction.save();
  }

  async getAllMasterTransactions(masterId: string) {
    const transactions = await Transaction.find({issuerId : masterId});
    return transactions;
  }


  async loadCard(cardLoadData: any) {
    const cardLoad = new CardLoad({
      ...cardLoadData,
      issuerModel: 'Master'
    });
    return cardLoad.save();
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

  async getPartners(masterId: string) {
    const master = await Master.findById(masterId).populate('partnersList');
    return master?.partnersList || [];
  }
}