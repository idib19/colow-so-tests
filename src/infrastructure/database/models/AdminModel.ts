import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../../../domain/schemas/BaseSchema';

interface IAdmin extends Document {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, baseSchemaOptions);

// Add index for faster queries
AdminSchema.index({ username: 1 });
AdminSchema.index({ email: 1 });

export const AdminModel = model<IAdmin>('Admin', AdminSchema); 