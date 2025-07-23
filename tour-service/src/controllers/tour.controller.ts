import { Request, Response } from 'express';
import { TourService } from '../services/tour.service';
import { asyncWrapper } from '../utils/asyncWrapper';
import { ICreateTourRequest, IUpdateTourRequest, ISearchTourParams } from '../types/tour';

interface SuccessResponse<T = unknown> {
  success: true;
  error: false;
  message: string;
  data?: T;
}

const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    error: false,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const TourController = {
  createTour: asyncWrapper(async (req: Request, res: Response) => {
    const tourData: ICreateTourRequest = req.body;
    const tour = await TourService.createTour(tourData);

    sendSuccessResponse(res, 'Tour created successfully', tour, 201);
  }),
  updateTour: asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const updates: IUpdateTourRequest = req.body;

    const tour = await TourService.updateTour(id, updates);

    sendSuccessResponse(res, 'Tour updated successfully', tour, 200);
  }),
  deleteTour: asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const tour = await TourService.deleteTour(id);

    sendSuccessResponse(res, 'Tour deleted successfully', tour, 200);
  }),
  getSingleTour: asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const tour = await TourService.getSingleTour(id);

    sendSuccessResponse(res, 'Tour retrieved successfully', tour, 200);
  }),
  getAllTour: asyncWrapper(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 8;

    const result = await TourService.getAllTours(page, limit);

    sendSuccessResponse(res, 'Tours retrieved successfully', result.tours, 200);
  }),
  getTourBySearch: asyncWrapper(async (req: Request, res: Response) => {
    const searchParams: ISearchTourParams = {};

    if (req.query.city) {
      searchParams.city = req.query.city as string;
    }

    const tours = await TourService.searchTours(searchParams);

    sendSuccessResponse(res, 'Tours retrieved successfully', tours, 200);
  }),
  getFeaturedTours: asyncWrapper(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8;
    const tours = await TourService.getFeaturedTours(limit);

    sendSuccessResponse(res, 'Featured tours retrieved successfully', tours, 200);
  }),
  getTourCount: asyncWrapper(async (_req: Request, res: Response) => {
    const result = await TourService.getTourCount();

    sendSuccessResponse(res, 'Tour count retrieved successfully', result.count, 200);
  }),
  getToursByPriceRange: asyncWrapper(async (req: Request, res: Response) => {
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    const tours = await TourService.getToursByPriceRange(minPrice, maxPrice);

    sendSuccessResponse(res, 'Tours retrieved successfully', tours, 200);
  }),
  getToursByCity: asyncWrapper(async (req: Request, res: Response) => {
    const city = req.params.city!;
    const tours = await TourService.getToursByCity(city);

    sendSuccessResponse(res, 'Tours retrieved successfully', tours, 200);
  }),
  updateTourFeaturedStatus: asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const { featured } = req.body;

    const tour = await TourService.updateTourFeaturedStatus(id, featured);

    sendSuccessResponse(res, 'Tour featured status updated successfully', tour, 200);
  }),
};
