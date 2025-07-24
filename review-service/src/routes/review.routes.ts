import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';

const router = Router();

// Create a new review
router.post('/', reviewController.createReview);

// Get all reviews with pagination
router.get('/', reviewController.getAllReviews);

// Get reviews for a specific tour
router.get('/tour/:tourId', reviewController.getReviewsByTour);

// Get reviews by a specific user
router.get('/user/:userId', reviewController.getReviewsByUser);

// Get average rating for a tour
router.get('/tour/:tourId/stats', reviewController.getTourAverageRating);

// Get a specific review by ID
router.get('/:reviewId', reviewController.getReviewById);

// Update a review
router.put('/:reviewId', reviewController.updateReview);

// Delete a review
router.delete('/:reviewId', reviewController.deleteReview);

export default router;