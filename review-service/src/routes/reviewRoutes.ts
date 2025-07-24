import express, { Router } from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getSingleReview,
  getAllReviews,
  getReviewsByUsername,
  getReviewsByRating,
} from '../controllers/reviewController';
import { verifyUser } from '../middlewares/verifyToken';

const router: Router = express.Router();

// Filter routes (must be before :id routes)
router.get('/user/:username', getReviewsByUsername);
router.get('/rating/:rating', getReviewsByRating);

// CRUD routes
router.get('/', getAllReviews);
router.post('/:tourId', verifyUser as express.RequestHandler, createReview);
router.get('/:id', getSingleReview);
router.put('/:id', verifyUser as express.RequestHandler, updateReview as express.RequestHandler);
router.delete('/:id', verifyUser as express.RequestHandler, deleteReview as express.RequestHandler);

export default router;
