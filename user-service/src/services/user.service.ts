import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../types/user';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';

export const UserService = {
  createUser: async (user: IUser) => {
    const existingUser = await UserRepository.findUserByEmail(user.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcryptjs.genSalt(10);
    const hasPassword = await bcryptjs.hash(user.password, salt);

    return await UserRepository.createUser({
      ...user,
      password: hasPassword,
    });
  },
  updateUser: async (id: string, user: IUser) => {
    const existingUser = await UserRepository.getSingleUser(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return await UserRepository.updateUser(id, user);
  },
  deleteUser: async (id: string) => {
    const existingUser = await UserRepository.getSingleUser(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return await UserRepository.deleteUser(id);
  },
  getSingleUser: async (id: string) => {
    const existingUser = await UserRepository.getSingleUser(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return existingUser;
  },
  getAllUser: async () => {
    return await UserRepository.getAllUser();
  },
  login: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existingUser = await UserRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken({
      ...existingUser,
      _id: existingUser._id.toString(),
      photo: existingUser.photo || '',
    });
    const refreshToken = generateRefreshToken({
      ...existingUser,
      _id: existingUser._id.toString(),
      photo: existingUser.photo || '',
    });

    await UserRepository.updateUserRefreshToken(existingUser._id.toString(), refreshToken);

    return {
      user: {
        _id: existingUser._id.toString(),
        role: existingUser.role,
        username: existingUser.username,
        email: existingUser.email,
        photo: existingUser.photo || '',
      },
      accessToken,
      refreshToken,
    };
  },
  logout: async (id: string) => {
    return await UserRepository.updateUserRefreshToken(id, '');
  },
  register: async (user: IUser) => {
    const existingUser = await UserRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return await UserRepository.createUser(user);
  },
  refreshToken: async (id: string, refreshToken: string) => {
    const existingUser = await UserRepository.getSingleUser(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    if (refreshToken !== existingUser.refresh_token) {
      throw new Error('Invalid refresh token');
    }

    const verifyRefreshToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN ?? '',
    );
    if (!verifyRefreshToken) {
      throw new Error('Token is expired');
    }

    const newAccessToken = generateAccessToken({
      ...existingUser,
      _id: existingUser._id.toString(),
      photo: existingUser.photo || '',
    });

    return newAccessToken;
  },
};
