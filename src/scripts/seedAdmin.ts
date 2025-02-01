import { seedAdminUser } from '../infrastructure/seeders/adminSeeder';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function runSeeder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Run the seeder
    await seedAdminUser();

    console.log('Admin seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runSeeder();