import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export interface ICardLoad extends Document {
  id: string;
  issuerId: Schema.Types.ObjectId;
  issuerModel: 'Master' | 'Partner';
  cardId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardLoadSchema = new Schema({
  issuerId: { type: Schema.Types.ObjectId, required: true, refPath: 'issuerModel' },
  issuerModel: { type: String, required: true, enum: ['Master', 'Partner'] },
  cardId: { type: String, required: true },
  amount: { type: Number, required: true }
}, baseSchemaOptions);

export const CardLoad = model<ICardLoad>('CardLoad', CardLoadSchema);