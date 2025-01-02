import { Schema, model, Document } from 'mongoose';

export interface IMaster extends Document {
  balance: number;
  partnersList: string[];
  totalCommission: number;
}

const MasterSchema = new Schema({
  balance: { type: Number, required: true, default: 0 },
  partnersList: [{ type: Schema.Types.ObjectId, ref: 'Partner' }],
  totalCommission: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export const Master = model<IMaster>('Master', MasterSchema);