import { TourModel } from '../models/Tour';
import { ITour, ITourDocument, IUpdateTourRequest, ISearchTourParams } from '../types/tour';
import { NotFoundError } from '../utils/errors';

export const TourRepository = {
  async createTour(tour: ITour): Promise<ITourDocument> {
    const newTour = new TourModel(tour);
    return await newTour.save();
  },

  async updateTour(id: string, updates: IUpdateTourRequest): Promise<ITourDocument> {
    const tour = await TourModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    return tour;
  },

  async deleteTour(id: string): Promise<ITourDocument> {
    const tour = await TourModel.findByIdAndDelete(id);

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    return tour;
  },

  async getTourById(id: string): Promise<ITourDocument> {
    const tour = await TourModel.findById(id).populate('reviews');

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    return tour;
  },

  async getAllTours(page: number = 0, limit: number = 8): Promise<ITourDocument[]> {
    return await TourModel.find({})
      .populate('reviews')
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  },

  async searchTours(params: ISearchTourParams): Promise<ITourDocument[]> {
    const query: Record<string, unknown> = {};

    if (params.city) {
      query.city = new RegExp(params.city, 'i');
    }

    if (params.distance) {
      query.distance = { $gte: params.distance };
    }

    if (params.maxGroupSize) {
      query.maxGroupSize = { $gte: params.maxGroupSize };
    }

    return await TourModel.find(query).populate('reviews').sort({ createdAt: -1 });
  },

  async getFeaturedTours(limit: number = 8): Promise<ITourDocument[]> {
    return await TourModel.find({ featured: true })
      .populate('reviews')
      .limit(limit)
      .sort({ createdAt: -1 });
  },

  async getTourCount(): Promise<number> {
    return await TourModel.estimatedDocumentCount();
  },

  async getToursByPriceRange(minPrice: number, maxPrice: number): Promise<ITourDocument[]> {
    return await TourModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .populate('reviews')
      .sort({ price: 1 });
  },

  async getToursByCity(city: string): Promise<ITourDocument[]> {
    return await TourModel.find({
      city: new RegExp(city, 'i'),
    })
      .populate('reviews')
      .sort({ createdAt: -1 });
  },

  async findTourByTitle(title: string): Promise<ITourDocument | null> {
    return await TourModel.findOne({ title });
  },

  async updateTourFeaturedStatus(id: string, featured: boolean): Promise<ITourDocument> {
    const tour = await TourModel.findByIdAndUpdate(
      id,
      { featured },
      { new: true, runValidators: true },
    );

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    return tour;
  },
};
