import { Request, Response } from 'express';
import Review from '../models/Review';
import Tour from '../models/Tour';

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({});

    res.status(200).json({ success: true, message: 'Successfully', data: reviews });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const tourId = req.params.tourId;
  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();

    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });

    res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to submit' });
  }
};
