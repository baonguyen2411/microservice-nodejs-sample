import jwt from 'jsonwebtoken';
import type { IUser } from '../types/user';

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY_ACCESS_TOKEN ?? '', {
    expiresIn: '15d',
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY_REFRESH_TOKEN ?? '', {
    expiresIn: '7d',
  });
};
