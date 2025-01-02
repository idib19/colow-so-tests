import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './infrastructure/database/connection';
import masterRoutes from './api/routes/master.routes';
import partnerRoutes from './api/routes/partner.routes';
import colowsoRoutes from './api/routes/colowso.routes';

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

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});