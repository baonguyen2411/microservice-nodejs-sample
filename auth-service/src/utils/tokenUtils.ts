import jwt from 'jsonwebtoken';
import type { IUser } from '../types/user';
import UserModel from '../models/User';

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY_ACCESS_TOKEN ?? '', {
    expiresIn: '15d',
  });
};

export const generateRefreshToken = async (user: IUser) => {
  const refreshToken = await jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY_REFRESH_TOKEN ?? '',
    {
      expiresIn: '7d',
    },
  );

  await UserModel.updateOne({ _id: user._id }, { refresh_token: refreshToken });

  return refreshToken;
};
