import { Schema, model, Document } from 'mongoose';

export interface IPartner extends Document {
  balance: number;
  masterId: Schema.Types.ObjectId;
  totalCommission: number;
}

const PartnerSchema = new Schema({
  balance: { type: Number, required: true, default: 0 },
  masterId: { type: Schema.Types.ObjectId, ref: 'Master', required: true },
  totalCommission: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export const Partner = model<IPartner>('Partner', PartnerSchema);