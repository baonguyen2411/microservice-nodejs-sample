export const config = {
  port: process.env.PORT || 3000,
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:4002',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api-gateway',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  //   secretKeyAccessToken: process.env.SECRET_KEY_ACCESS_TOKEN || 'secret-key-access-token',
  //   secretKeyRefreshToken: process.env.SECRET_KEY_REFRESH_TOKEN || 'secret-key-refresh-token',
} as const;
