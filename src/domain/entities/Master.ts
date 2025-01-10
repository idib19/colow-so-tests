import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface IMaster extends Document {
  id: string;
  country: string;
  balance: number;
  partnersList: Schema.Types.ObjectId[];
  totalCommission: number;
  assignedUserId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MasterSchema = new Schema({
  country: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  partnersList: [{ type: Schema.Types.ObjectId, ref: 'Partner' }],
  totalCommission: { type: Number, required: true, default: 0 },
  assignedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, baseSchemaOptions);

export const Master = model<IMaster>('Master', MasterSchema);