import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '../config';

// Helper function to extract and verify token
const extractAndVerifyToken = async (req: Request): Promise<jwt.JwtPayload> => {
  let token = req.cookies.accessToken;
  console.log('cookies:', req.cookies.accessToken);
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
  const decode = await jwt.verify(token, config.secretKeyAccessToken);
  if (!decode) {
    throw new Error('Unauthorized access');
  }
  return decode as jwt.JwtPayload;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decode = await extractAndVerifyToken(req);
    const role = decode.role;
    const userId = decode.id;
    
    // Add user information to request headers so downstream services can access it
    req.headers['x-user-id'] = userId;
    req.headers['x-user-role'] = role;
    
    // Also add to request object for potential local use
    (req as Request & { userId: string; userRole: string }).userId = userId;
    (req as Request & { userId: string; userRole: string }).userRole = role;
    
    console.log('Token verified successfully for user:', userId, 'with role:', role);
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
