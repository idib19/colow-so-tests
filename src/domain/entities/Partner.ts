import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface IPartner extends Document {
  id: string;
  country: string;
  balance: number;
  masterId: Schema.Types.ObjectId;
  totalCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema({
  country: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  masterId: { type: Schema.Types.ObjectId, ref: 'Master', required: true },
  totalCommission: { type: Number, required: true, default: 0 }
}, baseSchemaOptions);

export const Partner = model<IPartner>('Partner', PartnerSchema);