import { Request, Response, NextFunction } from 'express';
import { IAuthenticatedRequest } from '../types/tour';

type AsyncController = (
  req: Request | IAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

export const asyncWrapper = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
