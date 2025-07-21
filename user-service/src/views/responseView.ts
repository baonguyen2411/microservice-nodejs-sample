import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export class ResponseView {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      ...(data && { data })
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 400, error?: string): void {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error })
    };
    res.status(statusCode).json(response);
  }

  static serverError(res: Response, error: any): void {
    console.error('Server Error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }

  static notFound(res: Response, message: string = 'Not found'): void {
    const response: ApiResponse = {
      success: false,
      message
    };
    res.status(404).json(response);
  }

  static created<T>(res: Response, message: string, data?: T): void {
    this.success(res, message, data, 201);
  }
}