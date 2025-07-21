import User from '../models/User';
import { Types } from 'mongoose';

export interface UserData {
  username: string;
  email: string;
  password?: string;
  photo?: string;
  role?: string;
  status?: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  photo?: string;
  role?: string;
  status?: string;
}

export class UserService {
  async createUser(userData: UserData): Promise<any> {
    const newUser = new User(userData);
    return await newUser.save();
  }

  async updateUser(id: string, updateData: UserUpdateData): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }

    const deletedUser = await User.findByIdAndDelete(id).select('-password');
    
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return deletedUser;
  }

  async getUserById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getAllUsers(): Promise<any[]> {
    return await User.find({}).select('-password');
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserByUsername(username: string): Promise<any> {
    const user = await User.findOne({ username }).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const userService = new UserService();