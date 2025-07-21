import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import { IUser } from '../types/user';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  photo?: string;
  role?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  _id: string;
  email: string;
  username: string;
  photo?: string;
  role: string;
  status: string;
}

export class AuthService {
  async registerUser(userData: RegisterData): Promise<{ success: boolean; message: string }> {
    const { email, username, password, photo, role } = userData;

    // Check if user exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
      photo,
      role,
    });

    await newUser.save();

    return {
      success: true,
      message: 'User successfully created'
    };
  }

  async loginUser(loginData: LoginData): Promise<{ tokens: AuthTokens; user: UserData }> {
    const { username, password } = loginData;

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Find user
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      throw new Error('User not registered');
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate tokens
    const userPayload = {
      ...user,
      _id: user._id.toString(),
      photo: user.photo || '',
    };

    const accessToken = await generateAccessToken(userPayload);
    const refreshToken = await generateRefreshToken(userPayload);

    // Remove password from user data
    const { password: _, ...userData } = user;

    return {
      tokens: { accessToken, refreshToken },
      user: {
        ...userData,
        _id: user._id.toString()
      } as UserData
    };
  }

  async logoutUser(userId: string): Promise<{ success: boolean; message: string }> {
    await UserModel.findByIdAndUpdate(userId, { refresh_token: '' });

    return {
      success: true,
      message: 'Logout successfully'
    };
  }

  async refreshUserToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    // Verify refresh token
    const decoded = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN ?? ''
    ) as { _id: string };

    if (!decoded) {
      throw new Error('Token is expired');
    }

    // Find user
    const user = await UserModel.findById(decoded._id).lean();
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const newAccessToken = await generateAccessToken({
      ...user,
      _id: user._id.toString(),
      photo: user.photo || '',
    });

    return { accessToken: newAccessToken };
  }
}

export const authService = new AuthService();