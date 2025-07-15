import express, { Router } from 'express';
import {
  createTour,
  deleteTour,
  getAllTour,
  getFeaturedTours,
  getSingleTour,
  getTourBySearch,
  getTourCount,
  updateTour,
} from '../controllers/tourController';
import { verifyAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// create a new tour
router.post('/', verifyAdmin as express.RequestHandler, createTour as express.RequestHandler);
// update tour
router.put('/:id', verifyAdmin as express.RequestHandler, updateTour as express.RequestHandler);
// delete tour
router.delete('/:id', verifyAdmin as express.RequestHandler, deleteTour as express.RequestHandler);
// get single tour
router.get('/:id', getSingleTour);
// get all tour
router.get('/', getAllTour);
// get tour by search
router.get('/search/getTourBySearch', getTourBySearch);
// get featured tours
router.get('/search/getFeaturedTours', getFeaturedTours);
// get tour count
router.get('/search/getTourCount', getTourCount);

export default router;
