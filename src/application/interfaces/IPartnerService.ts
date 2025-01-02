import { ITransaction } from '../../domain/entities/Transaction';
import { ICardLoad } from '../../domain/entities/CardLoad';

export interface IPartnerService {
  createTransaction(transaction: Partial<ITransaction>): Promise<ITransaction>;
  loadCard(cardLoad: Partial<ICardLoad>): Promise<ICardLoad>;
  getBalance(partnerId: string): Promise<number>;
  getMetrics(partnerId: string): Promise<any>;
}