import { TourRepository } from '../repositories/tour.repository';
import {
  ITourResponse,
  ICreateTourRequest,
  IUpdateTourRequest,
  ISearchTourParams,
  ITourDocument,
} from '../types/tour';
import {
  validateCreateTourRequest,
  validateUpdateTourRequest,
  validateObjectId,
  validateSearchParams,
} from '../utils/validation';
import { ConflictError, ValidationError } from '../utils/errors';

export const TourService = {
  async createTour(tourData: ICreateTourRequest): Promise<ITourResponse> {
    validateCreateTourRequest(tourData);

    // Check if tour with the same title already exists
    const existingTour = await TourRepository.findTourByTitle(tourData.title);
    if (existingTour) {
      throw new ConflictError('Tour with this title already exists');
    }

    const newTour = await TourRepository.createTour(tourData);
    return this.formatTourResponse(newTour);
  },

  async updateTour(id: string, updates: IUpdateTourRequest): Promise<ITourResponse> {
    validateObjectId(id);
    validateUpdateTourRequest(updates);

    // Check if title conflicts with other tours
    if (updates.title) {
      const existingTour = await TourRepository.findTourByTitle(updates.title);
      if (existingTour && existingTour._id && existingTour._id.toString() !== id) {
        throw new ConflictError('Title already in use by another tour');
      }
    }

    const updatedTour = await TourRepository.updateTour(id, updates);
    return this.formatTourResponse(updatedTour);
  },

  async deleteTour(id: string): Promise<ITourResponse> {
    validateObjectId(id);
    const deletedTour = await TourRepository.deleteTour(id);
    return this.formatTourResponse(deletedTour);
  },

  async getSingleTour(id: string): Promise<ITourResponse> {
    validateObjectId(id);
    const tour = await TourRepository.getTourById(id);
    return this.formatTourResponse(tour);
  },

  async getAllTours(
    page: number = 0,
    limit: number = 8,
  ): Promise<{
    tours: ITourResponse[];
    count: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (page < 0) {
      throw new ValidationError('Page number must be non-negative');
    }

    if (limit <= 0 || limit > 50) {
      throw new ValidationError('Limit must be between 1 and 50');
    }

    const [tours, totalCount] = await Promise.all([
      TourRepository.getAllTours(page, limit),
      TourRepository.getTourCount(),
    ]);

    return {
      tours: tours.map((tour) => this.formatTourResponse(tour)),
      count: tours.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  },

  async searchTours(params: ISearchTourParams): Promise<ITourResponse[]> {
    validateSearchParams(params as Record<string, unknown>);

    const tours = await TourRepository.searchTours(params);
    return tours.map((tour) => this.formatTourResponse(tour));
  },

  async getFeaturedTours(limit: number = 8): Promise<ITourResponse[]> {
    if (limit <= 0 || limit > 50) {
      throw new ValidationError('Limit must be between 1 and 50');
    }

    const tours = await TourRepository.getFeaturedTours(limit);
    return tours.map((tour) => this.formatTourResponse(tour));
  },

  async getTourCount(): Promise<{ count: number }> {
    const count = await TourRepository.getTourCount();
    return { count };
  },

  async getToursByPriceRange(minPrice: number, maxPrice: number): Promise<ITourResponse[]> {
    if (minPrice < 0 || maxPrice < 0) {
      throw new ValidationError('Price values must be non-negative');
    }

    if (minPrice > maxPrice) {
      throw new ValidationError('Minimum price cannot be greater than maximum price');
    }

    const tours = await TourRepository.getToursByPriceRange(minPrice, maxPrice);
    return tours.map((tour) => this.formatTourResponse(tour));
  },

  async getToursByCity(city: string): Promise<ITourResponse[]> {
    if (!city || city.trim().length < 2) {
      throw new ValidationError('City name must be at least 2 characters long');
    }

    const tours = await TourRepository.getToursByCity(city.trim());
    return tours.map((tour) => this.formatTourResponse(tour));
  },

  async updateTourFeaturedStatus(id: string, featured: boolean): Promise<ITourResponse> {
    validateObjectId(id);

    const tour = await TourRepository.updateTourFeaturedStatus(id, featured);
    return this.formatTourResponse(tour);
  },

  // Helper method to format tour response
  formatTourResponse(tour: ITourDocument): ITourResponse {
    const response: ITourResponse = {
      _id: tour._id ? tour._id.toString() : '',
      title: tour.title,
      city: tour.city,
      address: tour.address,
      distance: tour.distance,
      photo: tour.photo,
      desc: tour.desc,
      price: tour.price,
      maxGroupSize: tour.maxGroupSize,
      featured: tour.featured || false,
    };

    if (tour.reviews) {
      response.reviews = tour.reviews;
    }

    if (tour.createdAt) {
      response.createdAt = tour.createdAt;
    }

    if (tour.updatedAt) {
      response.updatedAt = tour.updatedAt;
    }

    return response;
  },
};
