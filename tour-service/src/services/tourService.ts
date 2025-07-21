import Tour from '../models/Tour';
import { Types } from 'mongoose';

export interface TourData {
  title: string;
  city: string;
  address: string;
  distance: number;
  photo: string;
  desc: string;
  price: number;
  maxGroupSize: number;
  featured?: boolean;
}

export interface TourSearchParams {
  city?: string;
  distance?: number;
  maxGroupSize?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export class TourService {
  async createTour(tourData: TourData): Promise<any> {
    const newTour = new Tour(tourData);
    return await newTour.save();
  }

  async updateTour(id: string, updateData: Partial<TourData>): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid tour ID');
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedTour) {
      throw new Error('Tour not found');
    }

    return updatedTour;
  }

  async deleteTour(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid tour ID');
    }

    const deletedTour = await Tour.findByIdAndDelete(id);
    
    if (!deletedTour) {
      throw new Error('Tour not found');
    }

    return deletedTour;
  }

  async getTourById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid tour ID');
    }

    const tour = await Tour.findById(id).populate('reviews');
    
    if (!tour) {
      throw new Error('Tour not found');
    }

    return tour;
  }

  async getAllTours(pagination: PaginationParams): Promise<{ tours: any[]; count: number }> {
    const { page, limit } = pagination;
    const skip = page * limit;

    const tours = await Tour.find({})
      .skip(skip)
      .limit(limit);

    return {
      tours,
      count: tours.length
    };
  }

  async searchTours(searchParams: TourSearchParams): Promise<any[]> {
    const { city, distance, maxGroupSize } = searchParams;
    
    const query: any = {};

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (distance !== undefined && distance > 0) {
      query.distance = { $gte: distance };
    }

    if (maxGroupSize !== undefined && maxGroupSize > 0) {
      query.maxGroupSize = { $gte: maxGroupSize };
    }

    return await Tour.find(query).populate('reviews');
  }

  async getFeaturedTours(limit: number = 8): Promise<any[]> {
    return await Tour.find({ featured: true })
      .populate('reviews')
      .limit(limit);
  }

  async getTourCount(): Promise<number> {
    return await Tour.estimatedDocumentCount();
  }
}

export const tourService = new TourService();