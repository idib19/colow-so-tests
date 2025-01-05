import { MongoMemoryServer, MongoMemoryReplSet } from 'mongodb-memory-server';
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

type TestDBConfig = {
  useReplica?: boolean;
  replicaCount?: number;
};

// Database setup and teardown
export const setupTestDB = (config: TestDBConfig = { useReplica: false, replicaCount: 3 }) => {
  let mongod: MongoMemoryServer | MongoMemoryReplSet;

  beforeAll(async () => {
    if (config.useReplica) {
      mongod = await MongoMemoryReplSet.create({
        replSet: { count: config.replicaCount },
      });
    } else {
      mongod = await MongoMemoryServer.create();
    }
    
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

// Helper for creating person info in tests
export const createPersonInfo = (
  firstname: string,
  lastname: string,
  idCardNumber: string,
  phoneNumber: string,
  email: string
): PersonInfo => ({
  firstname,
  lastname,
  idCardNumber,
  city: 'TestCity',
  phoneNumber,
  email,
  reason: 'Test'
});

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
  return await Transaction.create({
    issuerId: new Types.ObjectId(issuerId),
    issuerModel,
    senderInfo: createPersonInfo(
      'John',
      'Doe',
      'ID123',
      '1234567890',
      'john@example.com'
    ),
    receiverInfo: createPersonInfo(
      'Jane',
      'Doe',
      'ID456',
      '0987654321',
      'jane@example.com'
    ),
    amount
  });
};