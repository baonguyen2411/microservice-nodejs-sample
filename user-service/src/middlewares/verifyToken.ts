import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken || req.cookies?.authorization?.split(' ');
    if (!token) {
      return res.status(401).json({ success: false, error: true, message: 'Provide token' });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN ?? '');
    if (!decode) {
      return res.status(401).json({ success: false, error: true, message: 'Unauthorized access' });
    }

    (req as Request & { userId: string }).userId = (decode as jwt.JwtPayload)?.id;
    next();
  } catch (error) {
    res.status(500).json({
      message: (error as Error)?.message || error,
      error: true,
      success: false,
    });
    return;
  }
};
