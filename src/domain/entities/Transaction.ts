import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  issuerId: Schema.Types.ObjectId;
  senderInfo: {
    name: string;
    contact: string;
  };
  receiverInfo: {
    name: string;
    contact: string;
  };
  status: 'pending' | 'completed' | 'failed';
  amount: number;
}

const TransactionSchema = new Schema({
  issuerId: { type: Schema.Types.ObjectId, required: true, refPath: 'issuerModel' },
  issuerModel: { type: String, required: true, enum: ['Master', 'Partner'] },
  senderInfo: {
    name: { type: String, required: true },
    contact: { type: String, required: true }
  },
  receiverInfo: {
    name: { type: String, required: true },
    contact: { type: String, required: true }
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  amount: { type: Number, required: true }
}, { timestamps: true });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);