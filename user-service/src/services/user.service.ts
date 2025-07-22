import bcryptjs from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import {
  IUserResponse,
  ILoginRequest,
  IRegisterRequest,
  IUpdateUserRequest,
  ILoginResponse,
  ITokenPayload,
} from '../types/user';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken';
import { ConflictError, AuthenticationError, ValidationError } from '../utils/errors';
import {
  validateLoginRequest,
  validateRegisterRequest,
  validateUpdateUserRequest,
  validateObjectId,
} from '../utils/validation';
import { IUserDocument } from '../types/user';

export const UserService = {
  async createUser(userData: IRegisterRequest): Promise<IUserResponse> {
    validateRegisterRequest(userData);

    // Check if user already exists
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      UserRepository.findUserByEmail(userData.email),
      UserRepository.findUserByUsername(userData.username),
    ]);

    if (existingUserByEmail) {
      throw new ConflictError('User with this email already exists');
    }

    if (existingUserByUsername) {
      throw new ConflictError('User with this username already exists');
    }

    // Hash password
    const salt = await bcryptjs.genSalt(12); // Increased salt rounds for better security
    const hashedPassword = await bcryptjs.hash(userData.password, salt);

    const newUser = await UserRepository.createUser({
      ...userData,
      password: hashedPassword,
      role: 'USER',
      status: 'Active',
    });

    return this.formatUserResponse(newUser);
  },

  async updateUser(id: string, updates: IUpdateUserRequest): Promise<IUserResponse> {
    validateObjectId(id);
    validateUpdateUserRequest(updates);

    // Check if email/username conflicts with other users
    if (updates.email) {
      const existingUser = await UserRepository.findUserByEmail(updates.email);
      if (existingUser && existingUser._id && existingUser._id.toString() !== id) {
        throw new ConflictError('Email already in use by another user');
      }
    }

    if (updates.username) {
      const existingUser = await UserRepository.findUserByUsername(updates.username);
      if (existingUser && existingUser._id && existingUser._id.toString() !== id) {
        throw new ConflictError('Username already in use by another user');
      }
    }

    const updatedUser = await UserRepository.updateUser(id, updates);
    return this.formatUserResponse(updatedUser);
  },

  async deleteUser(id: string): Promise<IUserResponse> {
    validateObjectId(id);
    const deletedUser = await UserRepository.deleteUser(id);
    return this.formatUserResponse(deletedUser);
  },

  async getSingleUser(id: string): Promise<IUserResponse> {
    validateObjectId(id);
    const user = await UserRepository.getUserById(id);
    return this.formatUserResponse(user);
  },

  async getAllUsers(): Promise<IUserResponse[]> {
    const users = await UserRepository.getAllUser();
    return users.map((user) => this.formatUserResponse(user));
  },

  async login(loginData: ILoginRequest): Promise<ILoginResponse> {
    validateLoginRequest(loginData);

    const user = await UserRepository.findUserByUsername(loginData.username);
    if (!user) {
      throw new AuthenticationError('Invalid username or password');
    }

    if (user.status !== 'Active') {
      throw new AuthenticationError('Account is not active');
    }

    const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const tokenPayload: ITokenPayload = {
      id: user._id ? user._id.toString() : '',
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update user's refresh token
    if (user._id) {
      await UserRepository.updateUserRefreshToken(user._id.toString(), refreshToken);
    }

    return {
      user: this.formatUserResponse(user),
      accessToken,
      refreshToken,
    };
  },

  async logout(userId: string): Promise<void> {
    validateObjectId(userId);
    await UserRepository.updateUserRefreshToken(userId, '');
  },

  async refreshToken(userId: string, refreshToken: string): Promise<string> {
    validateObjectId(userId);

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    const user = await UserRepository.getUserWithRefreshToken(userId);

    if (refreshToken !== user.refresh_token) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Verify the refresh token
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthenticationError('Refresh token expired or invalid');
    }

    const tokenPayload: ITokenPayload = {
      id: user._id ? user._id.toString() : '',
      role: user.role,
    };

    return generateAccessToken(tokenPayload);
  },

  async getUsersByRole(role: 'ADMIN' | 'USER'): Promise<IUserResponse[]> {
    const users = await UserRepository.getUsersByRole(role);
    return users.map((user) => this.formatUserResponse(user));
  },

  async updateUserStatus(
    id: string,
    status: 'Active' | 'Inactive' | 'Suspended',
  ): Promise<IUserResponse> {
    validateObjectId(id);
    const user = await UserRepository.updateUserStatus(id, status);
    return this.formatUserResponse(user);
  },

  async searchUsers(query: string): Promise<IUserResponse[]> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters long');
    }

    const users = await UserRepository.searchUsers(query.trim());
    return users.map((user) => this.formatUserResponse(user));
  },

  // Helper method to format user response
  formatUserResponse(user: IUserDocument): IUserResponse {
    const response: IUserResponse = {
      _id: user._id ? user._id.toString() : '',
      email: user.email,
      username: user.username,
      photo: user.photo || '',
      role: user.role,
      status: user.status,
    };

    if (user.createdAt) {
      response.createdAt = user.createdAt;
    }

    if (user.updatedAt) {
      response.updatedAt = user.updatedAt;
    }

    return response;
  },
};
