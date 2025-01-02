import { IMaster } from '../../domain/entities/Master';
import { ITransaction } from '../../domain/entities/Transaction';
import { ICardLoad } from '../../domain/entities/CardLoad';
import { ITransfer } from '../../domain/entities/Transfer';

export interface IMasterService {
  createTransaction(transaction: Partial<ITransaction>): Promise<ITransaction>;
  loadCard(cardLoad: Partial<ICardLoad>): Promise<ICardLoad>;
  createTransfer(transfer: Partial<ITransfer>): Promise<ITransfer>;
  getBalance(masterId: string): Promise<number>;
  getMetrics(masterId: string): Promise<any>;
  getPartners(masterId: string): Promise<any[]>;
}