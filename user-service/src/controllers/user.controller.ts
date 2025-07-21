import { CookieOptions, Request, Response } from 'express';
import { UserService } from '../services/user.service';

const cookiesOption = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
} as CookieOptions;

export const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const savedUser = await UserService.createUser(req.body);

      res.status(200).json({ success: true, message: 'Successfully created', data: savedUser });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(500).json({ success: false, message: 'Failed to create' });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const updatedUser = await UserService.updateUser(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Successfully updated',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(500).json({
        success: false,
        message: 'Failed to updated',
      });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const deletedUser = await UserService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'Successfully deleted',
        data: deletedUser,
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deleted',
      });
    }
  },
  getSingleUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const user = await UserService.getSingleUser(id);

      res.status(200).json({
        success: true,
        message: 'User found',
        data: user,
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(500).json({
        success: false,
        message: 'No user found',
      });
    }
  },
  getAllUser: async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUser();

      res.status(200).json({
        success: true,
        message: 'Users found',
        data: users,
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(404).json({
        success: false,
        message: 'Not found',
      });
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      await UserService.createUser(req.body);

      res.status(200).json({ success: true, message: 'User successfully created' });
    } catch (error) {
      console.error('Something went wrong: ', error);
      res.status(500).json({ success: false, message: 'Internal server error, Try again' });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { accessToken, refreshToken, user } = await UserService.login(
        req.body.email,
        req.body.password,
      );

      res.cookie('accessToken', accessToken, cookiesOption);
      res.cookie('refreshToken', refreshToken, cookiesOption);

      res
        .status(200)
        .json({ message: 'Login successfully', success: true, error: false, data: user });
    } catch (error) {
      res.status(500).json({
        message: (error as Error)?.message || error,
        error: true,
        success: false,
      });
      return;
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { userId: string }).userId;

      res.clearCookie('accessToken', cookiesOption);
      res.clearCookie('refreshToken', cookiesOption);

      await UserService.logout(userId);

      res.status(200).json({ message: 'Logout successfully', success: true, error: false });
    } catch (error) {
      res.status(500).json({
        message: (error as Error)?.message || error,
        error: true,
        success: false,
      });
      return;
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];
      const userId = (req as Request & { userId: string }).userId;

      const newAccessToken = await UserService.refreshToken(userId, refreshToken);

      res.cookie('accessToken', newAccessToken, cookiesOption);

      res.status(200).json({
        message: 'New access token generated successfully',
        success: true,
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        message: (error as Error)?.message || error,
        error: true,
        success: false,
      });
    }
  },
};
