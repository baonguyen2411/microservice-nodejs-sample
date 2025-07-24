import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  SECRET_KEY_ACCESS_TOKEN: string;
  FRONTEND_URL: string;
  USER_SERVICE_URI: string;
  TOUR_SERVICE_URI: string;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4005', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/review-service',
  SECRET_KEY_ACCESS_TOKEN: process.env.SECRET_KEY_ACCESS_TOKEN || 'your-secret-key',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  USER_SERVICE_URI: process.env.USER_SERVICE_URI || 'http://user-service:4002',
  TOUR_SERVICE_URI: process.env.TOUR_SERVICE_URI || 'http://tour-service:4003',
};