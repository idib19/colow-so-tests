import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface ITransfer extends Document {
  id: string;
  type: 1 | 2;
  amount: number;
  issuerId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema({
  type: { type: Number, required: true, enum: [1, 2] },
  amount: { type: Number, required: true },
  issuerId: { type: Schema.Types.ObjectId, required: true, ref: 'Master' }
}, baseSchemaOptions);

export const Transfer = model<ITransfer>('Transfer', TransferSchema);