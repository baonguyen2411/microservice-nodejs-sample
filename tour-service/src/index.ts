import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './utils/config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { ROUTES_PATH } from './constants/routesPath';
import tourRoutes from './routes/tourRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Database connection
mongoose.set('strictQuery', false);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ MongoDB database connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Handle database connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.NODE_ENV === 'production',
  }),
);

// General middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tour service is healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API routes
app.use(ROUTES_PATH.tour, tourRoutes);
app.use(ROUTES_PATH.review, reviewRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
