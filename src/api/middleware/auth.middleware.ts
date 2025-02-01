import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// First, let's add better type safety for roles
export type UserRole = 'master' | 'partner' | 'admin-colowso';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    entityId: string;
  }
}

export const authMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Add debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth Header:', authHeader);
      console.log('Allowed Roles:', allowedRoles);
    }

    if (!authHeader?.startsWith('Bearer')) {
      return res.status(401).json({ 
        message: 'No token provided',
        details: 'Authorization header must start with Bearer'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: UserRole;
        entityId: string;
      };

      // Add debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Decoded Token:', decoded);
        console.log('Role Check:', allowedRoles.includes(decoded.role));
      }

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          details: `Required roles: ${allowedRoles.join(', ')}, provided role: ${decoded.role}`
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      // Improve error handling
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          message: 'Invalid token',
          details: error.message 
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 