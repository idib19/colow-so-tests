import jwt from 'jsonwebtoken';

export const generateTestToken = (role: 'master' | 'partner' | 'admin-colowso', userId = '1', entityId = '1') => {
  return jwt.sign(
    { id: userId, role, entityId },
    process.env.JWT_SECRET || 'test-secret'
  );
};
