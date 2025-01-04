import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import masterRoutes from './api/routes/master.routes';
import partnerRoutes from './api/routes/partner.routes';
import colowsoRoutes from './api/routes/colowso.routes';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());

  // Routes
  app.use('/api/master', masterRoutes);
  app.use('/api/partner', partnerRoutes);
  app.use('/api/colowso', colowsoRoutes);

  return app;
};

// Only start the server if this file is run directly
if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}