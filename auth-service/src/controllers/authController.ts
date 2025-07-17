import { CookieOptions, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';

export const register = async (req: Request, res: Response) => {
  const { email, username, password, photo, role } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });
    // check if user exist
    if (userExists) {
      res.status(400).json({ message: 'User already exist' });
      return undefined;
    }

    // has password
    const salt = await bcryptjs.genSalt(10);
    const hasPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      email,
      username,
      password: hasPassword,
      photo,
      role,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: 'User successfully created' });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    if (!req.body?.username || !req.body?.password) {
      res.status(400).json({
        message: 'Provide username and password',
        error: true,
        success: false,
      });
      return;
    }

    const user = await UserModel.findOne({ username: req.body?.username }).lean();

    if (!user) {
      res.status(400).json({
        message: 'User not register',
        error: true,
        success: false,
      });
      return;
    }

    const { password, ...restUser } = user || {};
    const checkPassword = await bcryptjs.compare(req.body?.password, password);

    if (!checkPassword) {
      res.status(400).json({
        message: 'Check your password',
        error: true,
        success: false,
      });
      return;
    }

    const accessToken = await generateAccessToken({
      ...user,
      _id: user._id.toString(),
      photo: user.photo || '',
    });
    const refreshToken = await generateRefreshToken({
      ...user,
      _id: user._id.toString(),
      photo: user.photo || '',
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    } as CookieOptions;

    res.cookie('accessToken', accessToken, cookiesOption);
    res.cookie('refreshToken', refreshToken, cookiesOption);

    res
      .status(200)
      .json({ message: 'Login successfully', success: true, error: false, data: restUser });
  } catch (error) {
    res.status(500).json({
      message: (error as Error)?.message || error,
      error: true,
      success: false,
    });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    } as CookieOptions;

    res.clearCookie('accessToken', cookiesOption);
    res.clearCookie('refreshToken', cookiesOption);

    await UserModel.findByIdAndUpdate(userId, { refresh_token: '' });

    res.status(200).json({ message: 'Logout successfully', success: true, error: false });
  } catch (error) {
    res.status(500).json({
      message: (error as Error)?.message || error,
      error: true,
      success: false,
    });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token not found', error: true, success: false });
      return;
    }

    const verifyRefreshToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN ?? '',
    );

    if (!verifyRefreshToken) {
      res.status(401).json({ message: 'Token is expired', error: true, success: false });
      return;
    }

    const user = await UserModel.findById((verifyRefreshToken as { _id: string })?._id).lean();

    if (!user) {
      res.status(401).json({ message: 'User not found', error: true, success: false });
      return;
    }

    const newAccessToken = await generateAccessToken({
      ...user,
      _id: user._id.toString(),
      photo: user.photo || '',
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    } as CookieOptions;

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
};
