import { Schema, model, Document } from 'mongoose';

export interface ICardLoad extends Document {
  issuerId: Schema.Types.ObjectId;
  cardId: string;
  amount: number;
}

const CardLoadSchema = new Schema({
  issuerId: { type: Schema.Types.ObjectId, required: true, refPath: 'issuerModel' },
  issuerModel: { type: String, required: true, enum: ['Master', 'Partner'] },
  cardId: { type: String, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export const CardLoad = model<ICardLoad>('CardLoad', CardLoadSchema);