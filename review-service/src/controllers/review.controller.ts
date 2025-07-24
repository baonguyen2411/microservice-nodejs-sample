import { Request, Response } from 'express';
import { reviewService } from '../services/reviewService';
import { ICreateReviewDTO, IUpdateReviewDTO } from '../types/review';

class ReviewController {
  /**
   * Create a new review
   */
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { userId, tourId, reviewText, rating }: ICreateReviewDTO = req.body;

      // Validate required fields
      if (!userId || !tourId || !reviewText || rating === undefined) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: userId, tourId, reviewText, and rating are required',
        });
        return;
      }

      // Validate rating range
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5',
        });
        return;
      }

      const review = await reviewService.createReview({
        userId,
        tourId,
        reviewText,
        rating,
      });

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      console.error('Error creating review:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('does not exist') || 
                        errorMessage.includes('not active') ||
                        errorMessage.includes('already reviewed') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Get reviews for a specific tour
   */
  async getReviewsByTour(req: Request, res: Response): Promise<void> {
    try {
      const { tourId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!tourId) {
        res.status(400).json({
          success: false,
          message: 'Tour ID is required',
        });
        return;
      }

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100',
        });
        return;
      }

      const result = await reviewService.getReviewsByTour(tourId, page, limit);

      res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error getting reviews by tour:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Get reviews by a specific user
   */
  async getReviewsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
        return;
      }

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100',
        });
        return;
      }

      const result = await reviewService.getReviewsByUser(userId, page, limit);

      res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error getting reviews by user:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;

      if (!reviewId) {
        res.status(400).json({
          success: false,
          message: 'Review ID is required',
        });
        return;
      }

      const review = await reviewService.getReviewById(reviewId);

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Review not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Review retrieved successfully',
        data: review,
      });
    } catch (error) {
      console.error('Error getting review by ID:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Update a review
   */
  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { userId, reviewText, rating }: IUpdateReviewDTO & { userId: string } = req.body;

      if (!reviewId) {
        res.status(400).json({
          success: false,
          message: 'Review ID is required',
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
        return;
      }

      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
        res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5',
        });
        return;
      }

      const updateData: IUpdateReviewDTO = {};
      if (reviewText !== undefined) updateData.reviewText = reviewText;
      if (rating !== undefined) updateData.rating = rating;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one field (reviewText or rating) must be provided for update',
        });
        return;
      }

      const updatedReview = await reviewService.updateReview(reviewId, userId, updateData);

      if (!updatedReview) {
        res.status(404).json({
          success: false,
          message: 'Review not found or user not authorized',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: updatedReview,
      });
    } catch (error) {
      console.error('Error updating review:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') || errorMessage.includes('not authorized') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body;

      if (!reviewId) {
        res.status(400).json({
          success: false,
          message: 'Review ID is required',
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
        return;
      }

      const deleted = await reviewService.deleteReview(reviewId, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Review not found or user not authorized',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Get average rating for a tour
   */
  async getTourAverageRating(req: Request, res: Response): Promise<void> {
    try {
      const { tourId } = req.params;

      if (!tourId) {
        res.status(400).json({
          success: false,
          message: 'Tour ID is required',
        });
        return;
      }

      const result = await reviewService.getTourAverageRating(tourId);

      res.status(200).json({
        success: true,
        message: 'Tour rating statistics retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error getting tour average rating:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: statusCode === 500 ? errorMessage : undefined,
      });
    }
  }

  /**
   * Get all reviews with pagination
   */
  async getAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100',
        });
        return;
      }

      const result = await reviewService.getAllReviews(page, limit);

      res.status(200).json({
        success: true,
        message: 'All reviews retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error getting all reviews:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: errorMessage,
      });
    }
  }
}

export const reviewController = new ReviewController();