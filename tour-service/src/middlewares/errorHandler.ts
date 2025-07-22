import { Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { config } from '../utils/config';

interface ErrorResponse {
  success: false;
  error: true;
  message: string;
  stack?: string;
}

export const errorHandler = (error: Error | AppError, req: Request, res: Response): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: true,
    message,
  };

  // Include stack trace in development
  if (config.NODE_ENV === 'development' && error.stack) {
    errorResponse.stack = error.stack;
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: true,
    message: `Route ${req.originalUrl} not found`,
  });
};
