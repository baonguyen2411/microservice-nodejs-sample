import jwt from 'jsonwebtoken';
import { config } from './config';
import { ITokenPayload } from '../types/user';

export const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: '1h', // Reduced from 15 days for better security
    issuer: 'user-service',
    audience: 'user-service-client',
  });
};

export const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: '7d',
    issuer: 'user-service',
    audience: 'user-service-client',
  });
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.SECRET_KEY_ACCESS_TOKEN, {
    issuer: 'user-service',
    audience: 'user-service-client',
  }) as ITokenPayload;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.SECRET_KEY_REFRESH_TOKEN, {
    issuer: 'user-service',
    audience: 'user-service-client',
  }) as ITokenPayload;
};
