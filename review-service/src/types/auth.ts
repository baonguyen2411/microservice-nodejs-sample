import { Request } from 'express';
import { UserRoles } from './user';

export interface ITokenPayload {
  id: string;
  role: UserRoles;
}

export interface IAuthenticatedRequest extends Request {
  userId: string;
  userRole: string;
}
