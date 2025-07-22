import { Document, Types } from 'mongoose';
import { Request } from 'express';

export type UserRoles = 'ADMIN' | 'USER';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface IUser {
  _id?: string | Types.ObjectId;
  email: string;
  username: string;
  password: string;
  photo?: string;
  role: UserRoles;
  status: UserStatus;
  refresh_token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  photo?: string;
  role: UserRoles;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  photo?: string;
}

export interface IUpdateUserRequest {
  email?: string;
  username?: string;
  photo?: string;
  role?: UserRoles;
  status?: UserStatus;
}

export interface ILoginResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  id: string;
  role: UserRoles;
}

export interface IAuthenticatedRequest extends Request {
  userId: string;
  userRole: UserRoles;
}
