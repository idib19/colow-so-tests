import { IColowSoService } from '../interfaces/IColowSoService';
import { Master } from '../../domain/entities/Master';
import { Partner } from '../../domain/entities/Partner';
import { Transaction } from '../../domain/entities/Transaction';
import { Transfer } from '../../domain/entities/Transfer';
import { Claim } from '../../domain/entities/Claim';
import { CardLoad } from '../../domain/entities/CardLoad';
import { CreateMasterDTO } from '../dtos';

export class ColowSoService implements IColowSoService {

  // this function is to create a master account  not a user of type master  !!! 
<<<<<<< HEAD
  async createMaster(masterData: CreateMasterDTO, userId: string) {
    const master = new Master({
      ...masterData,
      balance: 0,
      totalCommission: 0,
      partnersList: [],
      assignedUserId: userId
    });
    await master.save();

    return master;

  }

  async loadMasterAccount(receiverId: string, amount: number, issuerId: string, type: 1 | 2) {
    if (type !== 1) {
      throw new Error('Invalid transfer type at ColowSoService.loadMasterAccount');
    }

    try {
      // First attempt to save the transfer
      const transfer = new Transfer({
        issuerId: issuerId,
        receiverId,
        amount,
        type: 1
      });
      
      const savedTransfer = await transfer.save();
      
      // Only if transfer saves successfully, update the master balance
      if (savedTransfer) {
        await Master.findByIdAndUpdate(
          receiverId,
          { $inc: { balance: amount } },
          { new: true }
        );
      }
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
=======
  async createMaster(masterData: CreateMasterDTO) {
    const master = new Master(masterData);
    await master.save();
    return master;
  }

  async loadMasterAccount(masterId: string, amount: number) {
    await Master.findByIdAndUpdate(
      masterId,
      { $inc: { balance: amount } },
      { new: true }
    );
>>>>>>> 7e7bdce (Deleted .env file)
  }

  async getAllTransactions() {
    return Transaction.find().sort({ createdAt: -1 }).exec();
  }

  async getAllTransfers() {
    return Transfer.find().sort({ createdAt: -1 }).exec();
  }

  async getAllClaims() {
    return Claim.find().sort({ createdAt: -1 }).exec();
  }

  async getMastersData() {
    return Master.find()
      .populate('partnersList')
      .populate('assignedUserId')
      .select('-__v')
      .lean()
      .exec();
  }

  async getPartnersData() {
    return Partner.find().populate('masterId').exec();
  }

  async getAllCardLoads() {
    return CardLoad.find().sort({ createdAt: -1 }).exec();
  }
}