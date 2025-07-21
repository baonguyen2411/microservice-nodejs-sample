import { CookieOptions, Request, Response } from 'express';
import { authService } from '../services/authService';
import { ResponseView } from '../views/responseView';

const cookiesOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, photo, role } = req.body;
    
    const result = await authService.registerUser({
      email,
      username,
      password,
      photo,
      role
    });

    ResponseView.success(res, result.message, null, 201);
  } catch (error) {
    if (error instanceof Error) {
      ResponseView.error(res, error.message, 400);
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    const result = await authService.loginUser({ username, password });

    // Set cookies
    res.cookie('accessToken', result.tokens.accessToken, cookiesOption);
    res.cookie('refreshToken', result.tokens.refreshToken, cookiesOption);

    ResponseView.success(res, 'Login successfully', result.user);
  } catch (error) {
    if (error instanceof Error) {
      ResponseView.error(res, error.message, 400);
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { userId: string }).userId;

    // Clear cookies
    res.clearCookie('accessToken', cookiesOption);
    res.clearCookie('refreshToken', cookiesOption);

    const result = await authService.logoutUser(userId);

    ResponseView.success(res, result.message);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];

    const result = await authService.refreshUserToken(refreshToken);

    // Set new access token cookie
    res.cookie('accessToken', result.accessToken, cookiesOption);

    ResponseView.success(res, 'New access token generated successfully');
  } catch (error) {
    if (error instanceof Error) {
      ResponseView.unauthorized(res, error.message);
    } else {
      ResponseView.serverError(res, error);
    }
  }
};
