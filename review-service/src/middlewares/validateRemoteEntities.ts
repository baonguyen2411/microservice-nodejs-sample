import { Request, Response, NextFunction } from 'express';
import { verifyUserExists, verifyTourExists } from '../utils/validation';
import { IAuthenticatedRequest } from '../types/auth';
import { ValidationError } from '../utils/errors';

export const validateUserExists = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as unknown as IAuthenticatedRequest;
    const userId = authReq.userId || req.params.userId;
    const cookie = req.headers.cookie || '';

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const userExists = await verifyUserExists(userId, cookie);
    if (!userExists) {
      throw new ValidationError('User does not exist');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateTourExists = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tourId = req.params.tourId;
    const cookie = req.headers.cookie || '';

    if (!tourId) {
      throw new ValidationError('Tour ID is required');
    }

    const tourExists = await verifyTourExists(tourId, cookie);
    if (!tourExists) {
      throw new ValidationError('Tour does not exist');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserAndTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate user first
    await validateUserExists(req, res, () => {});
    
    // Then validate tour
    await validateTourExists(req, res, () => {});
    
    next();
  } catch (error) {
    next(error);
  }
};