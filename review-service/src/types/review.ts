import { Document, Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  reviewText: string;
  rating: number;
}

export interface IReviewDocument extends IReview, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReviewDTO {
  userId: string;
  tourId: string;
  reviewText: string;
  rating: number;
}

export interface IUpdateReviewDTO {
  reviewText?: string;
  rating?: number;
}

export interface IReviewResponse {
  _id: string;
  user: {
    _id: string;
    username: string;
    photo?: string;
  };
  tour: {
    _id: string;
    title: string;
  };
  reviewText: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}