import mongoose from 'mongoose';
import { ReviewModel } from '../models/Review';
import { ICreateReviewDTO, IUpdateReviewDTO, IReviewDocument } from '../types/review';
import { verificationService } from './verificationService';

class ReviewService {
  /**
   * Create a new review with user and tour verification
   */
  async createReview(reviewData: ICreateReviewDTO): Promise<IReviewDocument> {
    const { userId, tourId, reviewText, rating } = reviewData;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      throw new Error('Invalid tour ID format');
    }

    // Verify user and tour exist
    const verification = await verificationService.verifyUserAndTour(userId, tourId);

    if (verification.errors && verification.errors.length > 0) {
      throw new Error(`Verification service errors: ${verification.errors.join(', ')}`);
    }

    if (!verification.userExists) {
      throw new Error('User does not exist or is not active');
    }

    if (!verification.tourExists) {
      throw new Error('Tour does not exist');
    }

    // Check if user has already reviewed this tour
    const existingReview = await ReviewModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      tour: new mongoose.Types.ObjectId(tourId),
    });

    if (existingReview) {
      throw new Error('User has already reviewed this tour');
    }

    // Create the review
    const review = new ReviewModel({
      user: new mongoose.Types.ObjectId(userId),
      tour: new mongoose.Types.ObjectId(tourId),
      reviewText,
      rating,
    });

    return await review.save();
  }

  /**
   * Get reviews for a specific tour
   */
  async getReviewsByTour(tourId: string, page = 1, limit = 10): Promise<{
    reviews: IReviewDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      throw new Error('Invalid tour ID format');
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find({ tour: new mongoose.Types.ObjectId(tourId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ReviewModel.countDocuments({ tour: new mongoose.Types.ObjectId(tourId) }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get reviews by a specific user
   */
  async getReviewsByUser(userId: string, page = 1, limit = 10): Promise<{
    reviews: IReviewDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find({ user: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ReviewModel.countDocuments({ user: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(reviewId: string): Promise<IReviewDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error('Invalid review ID format');
    }

    return await ReviewModel.findById(reviewId).exec();
  }

  /**
   * Update a review (only by the owner)
   */
  async updateReview(reviewId: string, userId: string, updateData: IUpdateReviewDTO): Promise<IReviewDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error('Invalid review ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Find the review and verify ownership
    const review = await ReviewModel.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!review) {
      throw new Error('Review not found or user not authorized to update this review');
    }

    // Update the review
    Object.assign(review, updateData);
    return await review.save();
  }

  /**
   * Delete a review (only by the owner)
   */
  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error('Invalid review ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const result = await ReviewModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: new mongoose.Types.ObjectId(userId),
    });

    return !!result;
  }

  /**
   * Get average rating for a tour
   */
  async getTourAverageRating(tourId: string): Promise<{ averageRating: number; totalReviews: number }> {
    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      throw new Error('Invalid tour ID format');
    }

    const result = await ReviewModel.aggregate([
      { $match: { tour: new mongoose.Types.ObjectId(tourId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: result[0].totalReviews,
    };
  }

  /**
   * Get all reviews with pagination
   */
  async getAllReviews(page = 1, limit = 10): Promise<{
    reviews: IReviewDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ReviewModel.countDocuments({}),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const reviewService = new ReviewService();