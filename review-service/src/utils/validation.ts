import { Types } from 'mongoose';
import { ValidationError } from './errors';
import { ICreateReviewRequest, IUpdateReviewRequest } from '../types/review';
import { RemoteUserService } from '../services/remote/user.service';
import { RemoteTourService } from '../services/remote/tour.service';

export function validateObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid ObjectId format');
  }
}

export function validateCreateReviewRequest(reviewData: ICreateReviewRequest): void {
  const { username, reviewText, rating } = reviewData;

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    throw new ValidationError('Username must be at least 2 characters long');
  }

  if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 5) {
    throw new ValidationError('Review text must be at least 5 characters long');
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw new ValidationError('Rating must be an integer between 1 and 5');
  }
}

export function validateUpdateReviewRequest(updates: IUpdateReviewRequest): void {
  if (Object.keys(updates).length === 0) {
    throw new ValidationError('At least one field must be provided for update');
  }

  if (updates.reviewText !== undefined) {
    if (typeof updates.reviewText !== 'string' || updates.reviewText.trim().length < 5) {
      throw new ValidationError('Review text must be at least 5 characters long');
    }
  }

  if (updates.rating !== undefined) {
    if (typeof updates.rating !== 'number' || updates.rating < 1 || updates.rating > 5 || !Number.isInteger(updates.rating)) {
      throw new ValidationError('Rating must be an integer between 1 and 5');
    }
  }
}

export async function verifyUserExists(userId: string, cookie: string): Promise<boolean> {
  try {
    const user = await RemoteUserService.getUserById(userId, cookie);
    return !!user;
  } catch (error) {
    console.error('[Validation] Failed to verify user existence:', error);
    return false;
  }
}

export async function verifyTourExists(tourId: string, cookie?: string): Promise<boolean> {
  try {
    const tour = await RemoteTourService.getTourById(tourId, cookie || '');
    return !!tour;
  } catch (error) {
    console.error('[Validation] Failed to verify tour existence:', error);
    return false;
  }
}