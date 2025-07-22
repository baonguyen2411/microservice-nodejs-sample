import { Document, Types } from 'mongoose';

export interface IReview {
  _id?: string | Types.ObjectId;
  productId: Types.ObjectId;
  username: string;
  reviewText: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface IReviewResponse {
  _id: string;
  productId: string;
  username: string;
  reviewText: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateReviewRequest {
  username: string;
  reviewText: string;
  rating: number;
}

export interface IUpdateReviewRequest {
  reviewText?: string;
  rating?: number;
}
