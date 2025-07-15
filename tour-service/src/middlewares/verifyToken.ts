import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// Helper function to extract and verify token
const extractAndVerifyToken = async (req: Request): Promise<jwt.JwtPayload> => {
  let token = req.cookies.accessToken;
  if (!token && req.headers.authorization) {
    // Expecting format: 'Bearer <token>'
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  if (!token) {
    throw new Error('Provide token');
  }
  const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN ?? '');
  if (!decode) {
    throw new Error('Unauthorized access');
  }
  return decode as jwt.JwtPayload;
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decode = await extractAndVerifyToken(req);
    const role = decode.role;
    if (role !== 'user' && role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, error: true, message: 'Forbidden: User access required' });
    }
    (req as Request & { userId: string; userRole: string }).userId = decode.id;
    (req as Request & { userId: string; userRole: string }).userRole = role;
    next();
  } catch (error) {
    res.status(401).json({
      message: (error as Error)?.message || error,
      error: true,
      success: false,
    });
    return;
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decode = await extractAndVerifyToken(req);
    const role = decode.role;
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, error: true, message: 'Forbidden: Admin access required' });
    }
    (req as Request & { userId: string; userRole: string }).userId = decode.id;
    (req as Request & { userId: string; userRole: string }).userRole = role;
    next();
  } catch (error) {
    res.status(401).json({
      message: (error as Error)?.message || error,
      error: true,
      success: false,
    });
    return;
  }
};
