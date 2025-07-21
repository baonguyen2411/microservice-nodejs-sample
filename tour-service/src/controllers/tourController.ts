import { Request, Response } from 'express';
import { tourService } from '../services/tourService';
import { ResponseView } from '../views/responseView';

// create new tour
export const createTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedTour = await tourService.createTour(req.body);
    ResponseView.created(res, 'Successfully created', savedTour);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

// update tour
export const updateTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedTour = await tourService.updateTour(id, req.body);
    ResponseView.success(res, 'Successfully updated', updatedTour);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

// delete tour
export const deleteTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedTour = await tourService.deleteTour(id);
    ResponseView.success(res, 'Successfully deleted', deletedTour);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

// get single tour
export const getSingleTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const tour = await tourService.getTourById(id);
    ResponseView.success(res, 'Successfully retrieved', tour);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        ResponseView.notFound(res, error.message);
      } else if (error.message.includes('Invalid')) {
        ResponseView.error(res, error.message, 400);
      } else {
        ResponseView.serverError(res, error);
      }
    } else {
      ResponseView.serverError(res, error);
    }
  }
};

// get all tour
export const getAllTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = 8; // Default limit
    
    const result = await tourService.getAllTours({ page, limit });
    ResponseView.success(res, 'Successfully retrieved', result.tours, 200, result.count);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

// get tours by search
export const getTourBySearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = {
      city: req.query.city as string,
      distance: req.query.distance ? parseInt(req.query.distance as string) : undefined,
      maxGroupSize: req.query.maxGroupSize ? parseInt(req.query.maxGroupSize as string) : undefined
    };

    const tours = await tourService.searchTours(searchParams);
    ResponseView.success(res, 'Successfully retrieved', tours);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

// get featured tours
export const getFeaturedTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const tours = await tourService.getFeaturedTours(limit);
    ResponseView.success(res, 'Successfully retrieved', tours);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};

// get tour count
export const getTourCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const tourCount = await tourService.getTourCount();
    ResponseView.success(res, 'Successfully retrieved', tourCount);
  } catch (error) {
    ResponseView.serverError(res, error);
  }
};
