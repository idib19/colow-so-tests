import { Schema, model, Document } from 'mongoose';

export interface ITransfer extends Document {
  type: boolean;
  amount: number;
  issuerId: Schema.Types.ObjectId;
}

const TransferSchema = new Schema({
  type: { type: Boolean, required: true },
  amount: { type: Number, required: true },
  issuerId: { type: Schema.Types.ObjectId, required: true, ref: 'Master' }
}, { timestamps: true });

export const Transfer = model<ITransfer>('Transfer', TransferSchema);