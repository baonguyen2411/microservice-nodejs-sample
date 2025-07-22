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
  getToursByPriceRange,
  getToursByCity,
  updateTourFeaturedStatus,
} from '../controllers/tourController';
import { verifyAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// Search and filter routes (must be before :id routes)
router.get('/search', getTourBySearch);
router.get('/featured', getFeaturedTours);
router.get('/count', getTourCount);
router.get('/price-range', getToursByPriceRange);
router.get('/city/:city', getToursByCity);

// CRUD routes
router.post('/', verifyAdmin as express.RequestHandler, createTour as express.RequestHandler);
router.get('/', getAllTour);
router.get('/:id', getSingleTour);
router.put('/:id', verifyAdmin as express.RequestHandler, updateTour as express.RequestHandler);
router.delete('/:id', verifyAdmin as express.RequestHandler, deleteTour as express.RequestHandler);

// Special operations
router.patch(
  '/:id/featured',
  verifyAdmin as express.RequestHandler,
  updateTourFeaturedStatus as express.RequestHandler,
);

export default router;
