import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  userServiceUrl: process.env.USER_SERVICE_URI || 'http://user-service:4001',
  tourServiceUrl: process.env.TOUR_SERVICE_URI || 'http://tour-service:4002',
  bookingServiceUrl: process.env.BOOKING_SERVICE_URI || 'http://booking-service:4003',
  mongoUrl: process.env.MONGO_URI,
  clientBaseUrl: process.env.FRONTEND_URL,
  secretKeyAccessToken: process.env.SECRET_KEY_ACCESS_TOKEN || 'secret-key-access-token',
  secretKeyRefreshToken: process.env.SECRET_KEY_REFRESH_TOKEN || 'secret-key-refresh-token',
} as const;
