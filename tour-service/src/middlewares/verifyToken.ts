import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/generateToken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { IAuthenticatedRequest } from '../types/auth';

const extractToken = (req: Request): string | undefined => {
  let token = req.cookies.accessToken;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    throw new AuthenticationError('Access token is required');
  }

  return token;
};

export const verifyUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    const decoded = verifyAccessToken(token ?? '');

    if (!decoded.role || !['USER', 'ADMIN'].includes(decoded.role)) {
      throw new AuthorizationError('Invalid user role');
    }

    // Extend request object with user info
    (req as unknown as IAuthenticatedRequest).userId = decoded.id;
    (req as unknown as IAuthenticatedRequest).userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    const decoded = verifyAccessToken(token ?? '');

    if (decoded.role !== 'ADMIN') {
      throw new AuthorizationError('Admin access required');
    }

    // Extend request object with user info
    (req as unknown as IAuthenticatedRequest).userId = decoded.id;
    (req as unknown as IAuthenticatedRequest).userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUserOrAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    const decoded = verifyAccessToken(token ?? '');
    const targetUserId = req.params.id;

    if (!decoded.role || !['USER', 'ADMIN'].includes(decoded.role)) {
      throw new AuthorizationError('Invalid user role');
    }

    // Allow if user is admin or accessing their own data
    if (decoded.role !== 'ADMIN' && decoded.id !== targetUserId) {
      throw new AuthorizationError('Access denied');
    }

    // Extend request object with user info
    (req as unknown as IAuthenticatedRequest).userId = decoded.id;
    (req as unknown as IAuthenticatedRequest).userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};
