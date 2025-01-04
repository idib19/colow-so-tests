import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../setup';
import supertest from 'supertest';
import { Master } from '../../domain/entities/Master';
import { Partner } from '../../domain/entities/Partner';
import { Transaction } from '../../domain/entities/Transaction';
import { PersonInfo } from '../../application/dtos/common/PersonInfo';
import { Types } from 'mongoose';

// Test request utility
export const testRequest = supertest(app);

// Database setup and teardown
export const setupTestDB = () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
};

// Test data creation utilities
export const createTestMaster = async (country: string = 'TestCountry', balance: number = 0) => {
  return await Master.create({ country, balance });
};

export const createTestPartner = async (masterId: string, country: string = 'TestCountry', balance: number = 0) => {
  return await Partner.create({ country, masterId, balance });
};

export const createTestTransaction = async (
  issuerId: string,
  issuerModel: 'Master' | 'Partner',
  amount: number,
) => {
  const senderInfo: PersonInfo = {
    firstname: 'John',
    lastname: 'Doe',
    idCardNumber: 'ID123',
    city: 'TestCity',
    phoneNumber: '1234567890',
    email: 'john@example.com',
    reason: 'Test transfer'
  };

  const receiverInfo: PersonInfo = {
    firstname: 'Jane',
    lastname: 'Doe',
    idCardNumber: 'ID456',
    city: 'TestCity',
    phoneNumber: '0987654321',
    email: 'jane@example.com',
    reason: 'Test receive'
  };

  return await Transaction.create({
    issuerId: new Types.ObjectId(issuerId),
    issuerModel,
    senderInfo,
    receiverInfo,
    amount
  });
};