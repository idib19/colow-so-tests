import { IColowSoService } from '../interfaces/IColowSoService';
import { Master } from '../../domain/entities/Master';
import { Partner } from '../../domain/entities/Partner';
import { Transaction } from '../../domain/entities/Transaction';
import { Transfer } from '../../domain/entities/Transfer';
import { Claim } from '../../domain/entities/Claim';
import { CardLoad } from '../../domain/entities/CardLoad';

export class ColowSoService implements IColowSoService {
  async loadMasterAccount(masterId: string, amount: number) {
    await Master.findByIdAndUpdate(
      masterId,
      { $inc: { balance: amount } },
      { new: true }
    );
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
    return Master.find().populate('partnersList').exec();
  }

  async getPartnersData() {
    return Partner.find().populate('masterId').exec();
  }

  async getAllCardLoads() {
    return CardLoad.find().sort({ createdAt: -1 }).exec();
  }
}