import { CookieOptions, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncWrapper } from '../utils/asyncWrapper';
import { IAuthenticatedRequest } from '../types/user';
import { config } from '../utils/config';

const cookiesOption: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOption,
  maxAge: 60 * 60 * 1000, // 1 hour
};

interface SuccessResponse<T = unknown> {
  success: true;
  error: false;
  message: string;
  data?: T;
}

const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    error: false,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const UserController = {
  createUser: asyncWrapper(async (req, res) => {
    const user = await UserService.createUser(req.body);
    sendSuccessResponse(res, 'User created successfully', user, 201);
  }),

  updateUser: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'User ID is required',
      });
      return;
    }
    const updatedUser = await UserService.updateUser(id, req.body);
    sendSuccessResponse(res, 'User updated successfully', updatedUser);
  }),

  deleteUser: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'User ID is required',
      });
      return;
    }
    const deletedUser = await UserService.deleteUser(id);
    sendSuccessResponse(res, 'User deleted successfully', deletedUser);
  }),

  getSingleUser: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'User ID is required',
      });
      return;
    }
    const user = await UserService.getSingleUser(id);
    sendSuccessResponse(res, 'User retrieved successfully', user);
  }),

  getAllUsers: asyncWrapper(async (_req, res) => {
    const users = await UserService.getAllUsers();
    sendSuccessResponse(res, 'Users retrieved successfully', users);
  }),

  login: asyncWrapper(async (req, res) => {
    const { accessToken, refreshToken, user } = await UserService.login(req.body);

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, cookiesOption);

    sendSuccessResponse(res, 'Login successful', { user, accessToken });
  }),

  logout: asyncWrapper(async (req, res) => {
    const authReq = req as IAuthenticatedRequest;
    await UserService.logout(authReq.userId);

    res.clearCookie('accessToken', cookiesOption);
    res.clearCookie('refreshToken', cookiesOption);

    sendSuccessResponse(res, 'Logout successful');
  }),

  refreshToken: asyncWrapper(async (req, res) => {
    const authReq = req as IAuthenticatedRequest;
    const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];

    const newAccessToken = await UserService.refreshToken(authReq.userId, refreshToken);

    res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

    sendSuccessResponse(res, 'Access token refreshed successfully', {
      accessToken: newAccessToken,
    });
  }),

  getUsersByRole: asyncWrapper(async (req, res) => {
    const { role } = req.params;

    if (!role || !['ADMIN', 'USER'].includes(role)) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid role parameter',
      });
      return;
    }

    const users = await UserService.getUsersByRole(role as 'ADMIN' | 'USER');
    sendSuccessResponse(res, `${role} users retrieved successfully`, users);
  }),

  updateUserStatus: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'User ID is required',
      });
      return;
    }

    if (!status || !['Active', 'Inactive', 'Suspended'].includes(status)) {
      res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid status value',
      });
      return;
    }

    const user = await UserService.updateUserStatus(id, status);
    sendSuccessResponse(res, 'User status updated successfully', user);
  }),

  searchUsers: asyncWrapper(async (req, res) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: true,
        message: 'Search query is required',
      });
      return;
    }

    const users = await UserService.searchUsers(q);
    sendSuccessResponse(res, 'Search completed successfully', users);
  }),

  getUserProfile: asyncWrapper(async (req, res) => {
    const authReq = req as IAuthenticatedRequest;
    const user = await UserService.getSingleUser(authReq.userId);
    sendSuccessResponse(res, 'Profile retrieved successfully', user);
  }),

  updateUserProfile: asyncWrapper(async (req, res) => {
    const authReq = req as IAuthenticatedRequest;
    // Users can only update their own profile (except admins)
    const targetUserId =
      authReq.userRole === 'ADMIN' ? req.params.id || authReq.userId : authReq.userId;

    const updatedUser = await UserService.updateUser(targetUserId, req.body);
    sendSuccessResponse(res, 'Profile updated successfully', updatedUser);
  }),
};
