import { NextFunction, Request, Response } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(401).json({ message: 'Provide token' });
  }
  next();
};
