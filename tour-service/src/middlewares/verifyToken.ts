import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// Helper function to extract user info from headers (set by API gateway)
const extractUserFromHeaders = (req: Request): { userId: string; userRole: string } | null => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  
  if (userId && userRole) {
    return { userId, userRole };
  }
  return null;
};

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
    // First try to get user info from headers (API gateway already verified)
    const headerUserInfo = extractUserFromHeaders(req);
    let userId: string;
    let userRole: string;
    
    if (headerUserInfo) {
      userId = headerUserInfo.userId;
      userRole = headerUserInfo.userRole;
      console.log('Using user info from API gateway headers:', { userId, userRole });
    } else {
      // Fallback to token verification for direct service calls
      const decode = await extractAndVerifyToken(req);
      userId = decode.id;
      userRole = decode.role;
      console.log('Verified token directly:', { userId, userRole });
    }
    
    if (userRole !== 'USER' && userRole !== 'ADMIN') {
      return res
        .status(403)
        .json({ success: false, error: true, message: 'Forbidden: User access required' });
    }
    
    (req as Request & { userId: string; userRole: string }).userId = userId;
    (req as Request & { userId: string; userRole: string }).userRole = userRole;
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
    // First try to get user info from headers (API gateway already verified)
    const headerUserInfo = extractUserFromHeaders(req);
    let userId: string;
    let userRole: string;
    
    if (headerUserInfo) {
      userId = headerUserInfo.userId;
      userRole = headerUserInfo.userRole;
      console.log('Using user info from API gateway headers:', { userId, userRole });
    } else {
      // Fallback to token verification for direct service calls
      const decode = await extractAndVerifyToken(req);
      userId = decode.id;
      userRole = decode.role;
      console.log('Verified token directly:', { userId, userRole });
    }
    
    if (userRole !== 'ADMIN') {
      return res
        .status(403)
        .json({ success: false, error: true, message: 'Forbidden: Admin access required' });
    }
    
    (req as Request & { userId: string; userRole: string }).userId = userId;
    (req as Request & { userId: string; userRole: string }).userRole = userRole;
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
