import { PersonInfo } from '../common/PersonInfo';

export interface CreateTransactionDTO {
  issuerId: string;
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
  amount: number;
  issuerModel: 'Master' | 'Partner';
}

export interface TransactionResponseDTO {
  id: string;
  issuerId: string;
  issuerModel: 'Master' | 'Partner';
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}