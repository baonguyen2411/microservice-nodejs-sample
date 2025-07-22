import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  PORT: number;
  MONGO_URI: string;
  FRONTEND_URL: string;
  SECRET_KEY_ACCESS_TOKEN: string;
  SECRET_KEY_REFRESH_TOKEN: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

function validateEnvironment(): EnvironmentConfig {
  const requiredEnvVars = [
    'MONGO_URI',
    'FRONTEND_URL',
    'SECRET_KEY_ACCESS_TOKEN',
    'SECRET_KEY_REFRESH_TOKEN',
  ];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    PORT: Number(process.env.PORT) || 8080,
    MONGO_URI: process.env.MONGO_URI!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    SECRET_KEY_ACCESS_TOKEN: process.env.SECRET_KEY_ACCESS_TOKEN!,
    SECRET_KEY_REFRESH_TOKEN: process.env.SECRET_KEY_REFRESH_TOKEN!,
    NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
  };
}

export const config = validateEnvironment();
