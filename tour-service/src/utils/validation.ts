import { ValidationError } from './errors';
import { ICreateTourRequest, IUpdateTourRequest } from '../types/tour';
import { ICreateReviewRequest, IUpdateReviewRequest } from '../types/review';

export const validateCreateTourRequest = (data: ICreateTourRequest): void => {
  const requiredFields = [
    'title',
    'city',
    'address',
    'distance',
    'photo',
    'desc',
    'price',
    'maxGroupSize',
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof ICreateTourRequest]) {
      throw new ValidationError(`${field} is required`);
    }
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    throw new ValidationError('Price must be a positive number');
  }

  if (typeof data.distance !== 'number' || data.distance <= 0) {
    throw new ValidationError('Distance must be a positive number');
  }

  if (typeof data.maxGroupSize !== 'number' || data.maxGroupSize <= 0) {
    throw new ValidationError('Max group size must be a positive number');
  }

  if (data.title.length < 3 || data.title.length > 100) {
    throw new ValidationError('Title must be between 3 and 100 characters');
  }

  if (data.desc.length < 10) {
    throw new ValidationError('Description must be at least 10 characters long');
  }
};

export const validateUpdateTourRequest = (data: IUpdateTourRequest): void => {
  if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) {
    throw new ValidationError('Price must be a positive number');
  }

  if (data.distance !== undefined && (typeof data.distance !== 'number' || data.distance <= 0)) {
    throw new ValidationError('Distance must be a positive number');
  }

  if (
    data.maxGroupSize !== undefined &&
    (typeof data.maxGroupSize !== 'number' || data.maxGroupSize <= 0)
  ) {
    throw new ValidationError('Max group size must be a positive number');
  }

  if (data.title !== undefined && (data.title.length < 3 || data.title.length > 100)) {
    throw new ValidationError('Title must be between 3 and 100 characters');
  }

  if (data.desc !== undefined && data.desc.length < 10) {
    throw new ValidationError('Description must be at least 10 characters long');
  }
};

export const validateObjectId = (id: string): void => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    throw new ValidationError('Invalid ID format');
  }
};

export const validateSearchParams = (params: Record<string, unknown>): void => {
  if (params.distance && isNaN(Number(params.distance))) {
    throw new ValidationError('Distance must be a valid number');
  }

  if (params.maxGroupSize && isNaN(Number(params.maxGroupSize))) {
    throw new ValidationError('Max group size must be a valid number');
  }

  if (params.page && isNaN(Number(params.page))) {
    throw new ValidationError('Page must be a valid number');
  }

  if (params.limit && isNaN(Number(params.limit))) {
    throw new ValidationError('Limit must be a valid number');
  }
};

export const validateCreateReviewRequest = (data: ICreateReviewRequest): void => {
  const requiredFields = ['username', 'reviewText', 'rating'];

  for (const field of requiredFields) {
    if (!data[field as keyof ICreateReviewRequest]) {
      throw new ValidationError(`${field} is required`);
    }
  }

  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    throw new ValidationError('Rating must be a number between 1 and 5');
  }

  if (data.username.length < 2 || data.username.length > 50) {
    throw new ValidationError('Username must be between 2 and 50 characters');
  }

  if (data.reviewText.length < 5 || data.reviewText.length > 500) {
    throw new ValidationError('Review text must be between 5 and 500 characters');
  }
};

export const validateUpdateReviewRequest = (data: IUpdateReviewRequest): void => {
  if (
    data.rating !== undefined &&
    (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5)
  ) {
    throw new ValidationError('Rating must be a number between 1 and 5');
  }

  if (
    data.reviewText !== undefined &&
    (data.reviewText.length < 5 || data.reviewText.length > 500)
  ) {
    throw new ValidationError('Review text must be between 5 and 500 characters');
  }
};
