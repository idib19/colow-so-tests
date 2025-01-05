import { Schema, model, Document } from 'mongoose';
import { baseSchemaOptions } from '../../../domain/schemas/BaseSchema';

export interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  role: 'master' | 'partner' | 'colowso';
  entityId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['master', 'partner', 'colowso'] 
  },
  entityId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: 'role' 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, baseSchemaOptions);

// Add indexes
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ entityId: 1 });

export const UserModel = model<IUser>('User', UserSchema); 