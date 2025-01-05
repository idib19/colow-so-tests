import { Model } from 'mongoose';
import { IRepository } from './interfaces/IRepository';
import { IUser, UserModel } from '../database/models/UserModel';

export class UserRepository implements IRepository<IUser> {
  private model: Model<IUser>;

  constructor() {
    this.model = UserModel;
  }

  async findById(id: string): Promise<IUser | null> {
    return this.model.findById(id).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.model.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    return this.model.create(user);
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { 
      lastLogin: new Date() 
    }).exec();
  }
} 