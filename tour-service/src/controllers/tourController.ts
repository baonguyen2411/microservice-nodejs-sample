import { Request, Response } from 'express';
import { TourService } from '../services/tour.service';
import { asyncWrapper } from '../utils/asyncWrapper';
import { ICreateTourRequest, IUpdateTourRequest, ISearchTourParams } from '../types/tour';

// create new tour
export const createTour = asyncWrapper(async (req: Request, res: Response) => {
  const tourData: ICreateTourRequest = req.body;
  const tour = await TourService.createTour(tourData);

  res.status(201).json({
    success: true,
    message: 'Tour created successfully',
    data: tour,
  });
});

// update tour
export const updateTour = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updates: IUpdateTourRequest = req.body;

  const tour = await TourService.updateTour(id, updates);

  res.status(200).json({
    success: true,
    message: 'Tour updated successfully',
    data: tour,
  });
});

// delete tour
export const deleteTour = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const tour = await TourService.deleteTour(id);

  res.status(200).json({
    success: true,
    message: 'Tour deleted successfully',
    data: tour,
  });
});

// get single tour
export const getSingleTour = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const tour = await TourService.getSingleTour(id);

  res.status(200).json({
    success: true,
    message: 'Tour retrieved successfully',
    data: tour,
  });
});

// get all tours with pagination
export const getAllTour = asyncWrapper(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 0;
  const limit = parseInt(req.query.limit as string) || 8;

  const result = await TourService.getAllTours(page, limit);

  res.status(200).json({
    success: true,
    message: 'Tours retrieved successfully',
    data: result.tours,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      count: result.count,
    },
  });
});

// get tours by search
export const getTourBySearch = asyncWrapper(async (req: Request, res: Response) => {
  const searchParams: ISearchTourParams = {};

  if (req.query.city) {
    searchParams.city = req.query.city as string;
  }
  if (req.query.distance) {
    searchParams.distance = Number(req.query.distance);
  }
  if (req.query.maxGroupSize) {
    searchParams.maxGroupSize = Number(req.query.maxGroupSize);
  }

  const tours = await TourService.searchTours(searchParams);

  res.status(200).json({
    success: true,
    message: 'Tours retrieved successfully',
    data: tours,
  });
});

// get featured tours
export const getFeaturedTours = asyncWrapper(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  const tours = await TourService.getFeaturedTours(limit);

  res.status(200).json({
    success: true,
    message: 'Featured tours retrieved successfully',
    data: tours,
  });
});

// get tour count
export const getTourCount = asyncWrapper(async (_req: Request, res: Response) => {
  const result = await TourService.getTourCount();

  res.status(200).json({
    success: true,
    message: 'Tour count retrieved successfully',
    data: result.count,
  });
});

// get tours by price range
export const getToursByPriceRange = asyncWrapper(async (req: Request, res: Response) => {
  const minPrice = Number(req.query.minPrice) || 0;
  const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

  const tours = await TourService.getToursByPriceRange(minPrice, maxPrice);

  res.status(200).json({
    success: true,
    message: 'Tours retrieved successfully',
    data: tours,
  });
});

// get tours by city
export const getToursByCity = asyncWrapper(async (req: Request, res: Response) => {
  const city = req.params.city!;
  const tours = await TourService.getToursByCity(city);

  res.status(200).json({
    success: true,
    message: 'Tours retrieved successfully',
    data: tours,
  });
});

// update tour featured status
export const updateTourFeaturedStatus = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id!;
  const { featured } = req.body;

  const tour = await TourService.updateTourFeaturedStatus(id, featured);

  res.status(200).json({
    success: true,
    message: 'Tour featured status updated successfully',
    data: tour,
  });
});
