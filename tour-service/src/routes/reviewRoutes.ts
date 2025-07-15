import express, { Router } from 'express';
import { createReview, getAllReviews } from '../controllers/reviewController';
import { verifyUser } from '../middlewares/verifyToken';

const router: Router = express.Router();

router.get('/', getAllReviews);
router.post('/:tourId', verifyUser as express.RequestHandler, createReview);

export default router;
