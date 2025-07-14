import User from '../models/User';
import { Request, Response } from 'express';

// create new user
export const createUser = async (req: Request, res: Response) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();

    res.status(200).json({ success: true, message: 'Successfully created', data: savedUser });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Successfully updated',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({
      success: false,
      message: 'Failed to updated',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Successfully deleted',
      data: deletedUser,
    });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deleted',
    });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id, { $set: req.body }, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: 'User found',
      data: user,
    });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(500).json({
      success: false,
      message: 'No user found',
    });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');

    res.status(200).json({
      success: true,
      message: 'Users found',
      data: users,
    });
  } catch (error) {
    console.error('Something went wrong: ', error);
    res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
};
