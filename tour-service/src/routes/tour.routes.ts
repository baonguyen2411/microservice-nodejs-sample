import express, { Router } from 'express';
import { TourController } from '../controllers/tour.controller';
import { verifyAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// Search and filter routes (must be before :id routes)
router.get('/search', TourController.getTourBySearch);
router.get('/featured', TourController.getFeaturedTours);
router.get('/count', TourController.getTourCount);
router.get('/price-range', TourController.getToursByPriceRange);
router.get('/city/:city', TourController.getToursByCity);

// CRUD routes
router.post('/', verifyAdmin as express.RequestHandler, TourController.createTour);
router.get('/', TourController.getAllTour);
router.get('/:id', TourController.getSingleTour);
router.put('/:id', verifyAdmin as express.RequestHandler, TourController.updateTour);
router.delete('/:id', verifyAdmin as express.RequestHandler, TourController.deleteTour);

// Special operations
router.patch(
  '/:id/featured',
  verifyAdmin as express.RequestHandler,
  TourController.updateTourFeaturedStatus,
);

export default router;
