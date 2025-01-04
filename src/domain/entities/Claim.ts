import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface IClaim extends Document {
  id: string;
  transactionId: Schema.Types.ObjectId;
  transactionIssuerId: Schema.Types.ObjectId;
  status: 'pending' | 'resolved' | 'rejected';
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema = new Schema({
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  transactionIssuerId: { type: Schema.Types.ObjectId, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  clientId: { type: String, required: true }
}, baseSchemaOptions);

export const Claim = model<IClaim>('Claim', ClaimSchema);