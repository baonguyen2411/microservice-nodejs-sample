import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface ITour {
  _id?: string | Types.ObjectId;
  title: string;
  city: string;
  address: string;
  distance: number;
  photo: string;
  desc: string;
  price: number;
  maxGroupSize: number;
  reviews?: Types.ObjectId[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITourDocument extends Omit<ITour, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface ITourResponse {
  _id: string;
  title: string;
  city: string;
  address: string;
  distance: number;
  photo: string;
  desc: string;
  price: number;
  maxGroupSize: number;
  reviews?: unknown[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateTourRequest {
  title: string;
  city: string;
  address: string;
  distance: number;
  photo: string;
  desc: string;
  price: number;
  maxGroupSize: number;
  featured?: boolean;
}

export interface IUpdateTourRequest {
  title?: string;
  city?: string;
  address?: string;
  distance?: number;
  photo?: string;
  desc?: string;
  price?: number;
  maxGroupSize?: number;
  featured?: boolean;
}

export interface ISearchTourParams {
  city?: string;
  distance?: number;
  maxGroupSize?: number;
  page?: number;
  limit?: number;
}

export interface IAuthenticatedRequest extends Request {
  userId: string;
  userRole: string;
}

export interface ITourCount {
  count: number;
}
