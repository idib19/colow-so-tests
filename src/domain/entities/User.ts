import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../schemas/BaseSchema';

export type UserRole = 'master' | 'partner' | 'admin-colowso';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  name: string;
  role: UserRole;
  entityId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['master', 'partner', 'admin-colowso'] },
  entityId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, baseSchemaOptions);

export const User = model<IUser>('User', UserSchema);

  