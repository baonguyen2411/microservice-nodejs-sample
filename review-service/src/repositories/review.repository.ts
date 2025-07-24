import Review from '../models/Review';
import { Types } from 'mongoose';
import { IReview, IReviewDocument, IUpdateReviewRequest } from '../types/review';
import { NotFoundError } from '../utils/errors';

export const ReviewRepository = {
  async createReview(review: IReview): Promise<IReviewDocument> {
    // Tour existence validation is now handled at the service layer with proper cookie context
    const newReview = new Review(review);
    const savedReview = await newReview.save();

    // Note: Tour review array updates should be handled by the tour service via API call
    // This maintains service boundaries and prevents direct database coupling

    return savedReview;
  },

  async updateReview(id: string, updates: IUpdateReviewRequest): Promise<IReviewDocument> {
    const review = await Review.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return review;
  },

  async deleteReview(id: string): Promise<IReviewDocument> {
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Note: Tour review array updates should be handled by the tour service via API call
    // This maintains service boundaries and prevents direct database coupling

    return review;
  },

  async getReviewById(id: string): Promise<IReviewDocument> {
    const review = await Review.findById(id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return review;
  },

  async getAllReviews(): Promise<IReviewDocument[]> {
    return await Review.find({}).sort({ createdAt: -1 });
  },

  async getReviewsByTourId(tourId: string): Promise<IReviewDocument[]> {
    return await Review.find({ productId: tourId }).sort({ createdAt: -1 });
  },

  async getReviewsByUsername(username: string): Promise<IReviewDocument[]> {
    return await Review.find({ username }).sort({ createdAt: -1 });
  },

  async getReviewsByRating(rating: number): Promise<IReviewDocument[]> {
    return await Review.find({ rating }).sort({ createdAt: -1 });
  },

  async getAverageRating(tourId: string): Promise<number> {
    const result = await Review.aggregate([
      { $match: { productId: new Types.ObjectId(tourId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    return result.length > 0 ? result[0].averageRating : 0;
  },
};
