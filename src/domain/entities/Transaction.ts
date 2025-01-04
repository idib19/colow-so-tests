import { Schema, model, Document } from 'mongoose';
import { PersonInfo } from '../../application/dtos/common/PersonInfo';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface ITransaction extends Document {
  id: string;
  issuerId: Schema.Types.ObjectId;
  issuerModel: 'Master' | 'Partner';
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PersonInfoSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  idCardNumber: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true }
}, { _id: false });

const TransactionSchema = new Schema({
  issuerId: { type: Schema.Types.ObjectId, required: true, refPath: 'issuerModel' },
  issuerModel: { type: String, required: true, enum: ['Master', 'Partner'] },
  senderInfo: { type: PersonInfoSchema, required: true },
  receiverInfo: { type: PersonInfoSchema, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  amount: { type: Number, required: true }
}, baseSchemaOptions);

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);