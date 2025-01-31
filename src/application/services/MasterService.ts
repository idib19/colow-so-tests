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
import { Claim } from '../../domain/entities/Claim';

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

      await this.updateCommission(master.id, transactionData.amount);

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

  async getMetricsV2(masterId: string) {

   

    const [
      balance,
      cardLoads,
      totalCardLoadAmount,
      commission,
      claims,
      lastColowsoTransfert
    ] = await Promise.all([
      this.getBalance(masterId),
      getCardLoadsByIssuerId(masterId),
      calculateTotalCardLoadAmount(masterId),
      this.getCommission(masterId),
      this.getClaims(masterId),
      this.getLastColowsoTransfert(masterId)
    ]);

    return {
      balance,
      cardLoadCount: cardLoads.length,
      totalCardLoadAmount,
      commission,
      claims,
      lastColowsoTransfert
    };
  }

  // Get the commission for the last 4 months
  async getCommission(masterId: string) {
    // For development/testing, return mock data
    const mockCommissionData = [
      { month: 'Jan', value: 400 },
      { month: 'Feb', value: 300 },
      { month: 'Mar', value: 500 },
      { month: 'Apr', value: 450 },
    ];

    // Keep the real implementation commented out for later use
    /* 
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    
    const master = await Master.findById(masterId);
    if (!master) {
      throw new Error('Master not found');
    }

    const recentCommissions = master.commissionHistory
      .filter(entry => entry.month >= fourMonthsAgo)
      .reduce((acc, entry) => acc + entry.amount, 0);

    return recentCommissions || [];
    */

    return mockCommissionData;
  }

  // get all claims for this master
  async getClaims(masterId: string) {
    // For development/testing, return mock data
    const mockClaimsData = [
      { status: 'resolved', value: 30 },
      { status: 'pending', value: 15 },
      { status: 'rejected', value: 5 },
    ];

    // Keep the real implementation commented out for later use
    /*
    if (!masterId) {
      throw new Error('Unsufficient data');
    }
    const claims = await Claim.find({transactionIssuerId: masterId});
    if (!claims) {
      throw new Error('No claims found');
    }
    return claims || [];
    */

    return mockClaimsData;
  }

  async getLastColowsoTransfert(masterId: string) {
    const lastTransfer = await Transfer.findOne({ 
      receiverId: masterId,
      type: 1
    })
    .select('amount createdAt')  // Only select these fields
    .sort({ createdAt: -1 });
     
    return lastTransfer ? {
      amount: lastTransfer.amount,
      createdAt: lastTransfer.createdAt
    } : 0;
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

  // This function is for dynamicaly update the comission history of a master after a transaction worthy of comission is made
  async updateCommission(masterId: string, amount: number) {
    const currentMonth = new Date();
    currentMonth.setDate(1); // First day of current month
    currentMonth.setHours(0, 0, 0, 0);

    await Master.findByIdAndUpdate(
      masterId,
      {
        $inc: { totalCommission: amount },
        $push: {
          commissionHistory: {
            month: currentMonth,
            amount: amount
          }
        }
      }
    );
  }

 

}