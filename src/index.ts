import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import masterRoutes from './api/routes/master.routes';
import partnerRoutes from './api/routes/partner.routes';
import colowsoRoutes from './api/routes/colowso.routes';
import { authMiddleware } from './api/middleware/auth.middleware';
import authRoutes from './api/routes/auth.routes';
import { connectDB } from './infrastructure/database/connection';
// Load environment variables
dotenv.config();

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());

  // Public routes (login endpoints will be here)
  app.use('/api/auth', authRoutes);

  // Protected routes
  app.use('/api/master', authMiddleware(['master']), masterRoutes);
  app.use('/api/partner', authMiddleware(['partner']), partnerRoutes);
  app.use('/api/colowso', authMiddleware(['admin-colowso']), colowsoRoutes);

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  return app;
};

// Only start the server if this file is run directly
if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    connectDB();
  });
}