import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config();

export async function seedAdminUser() {
  // Environment checks
  if (!process.env.ALLOW_ADMIN_SEEDING || process.env.ALLOW_ADMIN_SEEDING === 'false') {
    console.log('Admin seeding is disabled');
    return;
  }

  // Production safeguard
  if (process.env.NODE_ENV === 'production') {
    const userRepository = new UserRepository();
    const adminExists = await userRepository.findByUsername('admin-colowso');
    
    if (adminExists) {
      console.log('Security: Blocked admin seeding attempt in production');
      return;
    }
  }

  // Additional security checks
  if (!process.env.ADMIN_INITIAL_PASSWORD || 
      process.env.ADMIN_INITIAL_PASSWORD === '12345678') {
    throw new Error('Default or empty admin password detected. Please set a secure password.');
  }

  const userRepository = new UserRepository();

  try {
    // Check if admin already exists
    const existingAdmin = await userRepository.findByUsername('admin-colowso');
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Get admin credentials from environment variables
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_INITIAL_PASSWORD not set in environment variables');
    }

    // TODO : ADD VALIDATION FOR PASSWORD LATER 

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await userRepository.create({
      username: 'admin-colowso',
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL || 'admin@colowso.com',
      role: 'admin-colowso',
      entityId: 'colowso-admin-entity',
      isActive: true,
      name: 'Colowso Admin'
    });

    console.log('Admin user created successfully:', adminUser.username);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }


} 