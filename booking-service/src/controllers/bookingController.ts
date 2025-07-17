import { Request, Response } from 'express';
import Booking from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  const newBooking = new Booking(req.body);

  try {
    const savedBooking = await newBooking.save();

    res.status(200).json({ success: true, message: 'Your tour is booked', data: savedBooking });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to submit' });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const book = await Booking.findById(id);

    res.status(200).json({ success: true, message: 'Successfully', data: book });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

export const getAllBooking = async (req: Request, res: Response) => {
  try {
    const books = await Booking.find();

    res.status(200).json({ success: true, message: 'Successfully', data: books });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({ success: false, message: 'Not found' });
  }
};
