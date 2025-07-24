import { Types } from 'mongoose';
import { ReviewRepository } from '../repositories/review.repository';
import {
  IReviewResponse,
  ICreateReviewRequest,
  IUpdateReviewRequest,
  IReviewDocument,
} from '../types/review';
import {
  validateCreateReviewRequest,
  validateUpdateReviewRequest,
  validateObjectId,
  verifyTourExists,
} from '../utils/validation';
import { ValidationError } from '../utils/errors';

export const ReviewService = {
  async createReview(tourId: string, reviewData: ICreateReviewRequest, cookie?: string): Promise<IReviewResponse> {
    validateObjectId(tourId);
    validateCreateReviewRequest(reviewData);

    // Validate that the tour exists using remote service
    if (!(await verifyTourExists(tourId, cookie))) {
      throw new ValidationError('Tour does not exist');
    }

    const review = {
      ...reviewData,
      productId: new Types.ObjectId(tourId),
    };

    const newReview = await ReviewRepository.createReview(review);
    return this.formatReviewResponse(newReview);
  },

  async updateReview(id: string, updates: IUpdateReviewRequest): Promise<IReviewResponse> {
    validateObjectId(id);
    validateUpdateReviewRequest(updates);

    const updatedReview = await ReviewRepository.updateReview(id, updates);
    return this.formatReviewResponse(updatedReview);
  },

  async deleteReview(id: string): Promise<IReviewResponse> {
    validateObjectId(id);
    const deletedReview = await ReviewRepository.deleteReview(id);
    return this.formatReviewResponse(deletedReview);
  },

  async getSingleReview(id: string): Promise<IReviewResponse> {
    validateObjectId(id);
    const review = await ReviewRepository.getReviewById(id);
    return this.formatReviewResponse(review);
  },

  async getAllReviews(): Promise<IReviewResponse[]> {
    const reviews = await ReviewRepository.getAllReviews();
    return reviews.map((review) => this.formatReviewResponse(review));
  },

  async getReviewsByTour(tourId: string): Promise<IReviewResponse[]> {
    validateObjectId(tourId);

    const reviews = await ReviewRepository.getReviewsByTourId(tourId);
    return reviews.map((review) => this.formatReviewResponse(review));
  },

  async getReviewsByUsername(username: string): Promise<IReviewResponse[]> {
    if (!username || username.trim().length < 2) {
      throw new ValidationError('Username must be at least 2 characters long');
    }

    const reviews = await ReviewRepository.getReviewsByUsername(username.trim());
    return reviews.map((review) => this.formatReviewResponse(review));
  },

  async getReviewsByRating(rating: number): Promise<IReviewResponse[]> {
    if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    const reviews = await ReviewRepository.getReviewsByRating(rating);
    return reviews.map((review) => this.formatReviewResponse(review));
  },

  async getTourAverageRating(tourId: string): Promise<{ averageRating: number }> {
    validateObjectId(tourId);

    const averageRating = await ReviewRepository.getAverageRating(tourId);
    return { averageRating: Math.round(averageRating * 100) / 100 }; // Round to 2 decimal places
  },

  // Helper method to format review response
  formatReviewResponse(review: IReviewDocument): IReviewResponse {
    const response: IReviewResponse = {
      _id: review._id ? review._id.toString() : '',
      productId: review.productId.toString(),
      username: review.username,
      reviewText: review.reviewText,
      rating: review.rating,
    };

    if (review.createdAt) {
      response.createdAt = review.createdAt;
    }

    if (review.updatedAt) {
      response.updatedAt = review.updatedAt;
    }

    return response;
  },
};
