import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'master' | 'partner' | 'admin-colowso';
    entityId: string;
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }


    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: 'master' | 'partner' | 'admin-colowso';
        entityId: string;
      };

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        entityId: decoded.entityId
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}; 