import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { asyncWrapper } from '../utils/asyncWrapper';
import { ICreateReviewRequest, IUpdateReviewRequest } from '../types/review';

// create review
export const createReview = asyncWrapper(async (req: Request, res: Response) => {
  const tourId = req.params.tourId!;
  const reviewData: ICreateReviewRequest = req.body;
  
  // Extract cookie for remote service validation
  const cookie = req.headers.cookie || '';

  const review = await ReviewService.createReview(tourId, reviewData, cookie);

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review,
  });
});

// update review
export const updateReview = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updates: IUpdateReviewRequest = req.body;

  const review = await ReviewService.updateReview(id, updates);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

// delete review
export const deleteReview = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const review = await ReviewService.deleteReview(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: review,
  });
});

// get single review
export const getSingleReview = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const review = await ReviewService.getSingleReview(id);

  res.status(200).json({
    success: true,
    message: 'Review retrieved successfully',
    data: review,
  });
});

// get all reviews
export const getAllReviews = asyncWrapper(async (_req: Request, res: Response) => {
  const reviews = await ReviewService.getAllReviews();

  res.status(200).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
  });
});

// get reviews by tour
export const getReviewsByTour = asyncWrapper(async (req: Request, res: Response) => {
  const tourId = req.params.tourId!;
  const reviews = await ReviewService.getReviewsByTour(tourId);

  res.status(200).json({
    success: true,
    message: 'Tour reviews retrieved successfully',
    data: reviews,
  });
});

// get reviews by username
export const getReviewsByUsername = asyncWrapper(async (req: Request, res: Response) => {
  const username = req.params.username!;
  const reviews = await ReviewService.getReviewsByUsername(username);

  res.status(200).json({
    success: true,
    message: 'User reviews retrieved successfully',
    data: reviews,
  });
});

// get reviews by rating
export const getReviewsByRating = asyncWrapper(async (req: Request, res: Response) => {
  const rating = Number(req.params.rating);
  const reviews = await ReviewService.getReviewsByRating(rating);

  res.status(200).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
  });
});

// get tour average rating
export const getTourAverageRating = asyncWrapper(async (req: Request, res: Response) => {
  const tourId = req.params.tourId!;
  const result = await ReviewService.getTourAverageRating(tourId);

  res.status(200).json({
    success: true,
    message: 'Average rating retrieved successfully',
    data: result,
  });
});
