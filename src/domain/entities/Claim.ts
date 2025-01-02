import { Schema, model, Document } from 'mongoose';

export interface IClaim extends Document {
  transactionId: Schema.Types.ObjectId;
  status: 'pending' | 'resolved' | 'rejected';
  clientId: string;
}

const ClaimSchema = new Schema({
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  clientId: { type: String, required: true }
}, { timestamps: true });

export const Claim = model<IClaim>('Claim', ClaimSchema);