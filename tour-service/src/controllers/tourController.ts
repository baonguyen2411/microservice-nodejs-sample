import Tour from '../models/Tour';
import { Request, Response } from 'express';

// create new tour
export const createTour = async (req: Request, res: Response) => {
  const newTour = new Tour(req.body);

  try {
    const savedTour = await newTour.save();

    res.status(200).json({ success: true, message: 'Successfully created', data: savedTour });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
};

// update tour
export const updateTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: 'Successfully updated', data: updatedTour });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
};

// delete tour
export const deleteTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedTour = await Tour.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Successfully deleted', data: deletedTour });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};

// get single tour
export const getSingleTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate('reviews');
    res.status(200).json({ success: true, message: 'Successfully', data: tour });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

// get all tour
export const getAllTour = async (req: Request, res: Response) => {
  // for pagination
  const page = parseInt(req.query.page as string) || 0;

  try {
    const tours = await Tour.find({})
      .skip(page * 8)
      .limit(8);
    res
      .status(200)
      .json({ success: true, count: tours.length, message: 'Successfully', data: tours });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

// get tours by search
export const getTourBySearch = async (req: Request, res: Response) => {
  const city =
    req.query?.city && typeof req.query.city === 'string' ? RegExp(req.query.city, 'i') : '';
  const distance = req.query.distance || 0;
  const maxGroupSize = req.query.maxGroupSize || 0;

  try {
    const tours = await Tour.find({
      city,
      distance: {
        $gte: +distance,
      },
      maxGroupSize: {
        $gte: +maxGroupSize,
      },
    }).populate('reviews');

    res.status(200).json({ success: true, message: 'Successfully', data: tours });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

// get featured tours
export const getFeaturedTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find({
      featured: true,
    })
      .populate('reviews')
      .limit(8);

    res.status(200).json({ success: true, message: 'Successfully', data: tours });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

// get tour count
export const getTourCount = async (req: Request, res: Response) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();

    res.status(200).json({ success: true, message: 'Successfully', data: tourCount });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Failed to get tour count' });
  }
};
