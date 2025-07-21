import { UserModel } from '../models/User';
import { IUser } from '../types/user';

export const UserRepository = {
  createUser: async (user: IUser) => {
    const newUser = new UserModel(user);
    return await newUser.save();
  },
  updateUser: async (id: string, user: IUser) => {
    return await UserModel.findByIdAndUpdate(id, { $set: user }, { new: true });
  },
  deleteUser: async (id: string) => {
    return await UserModel.findByIdAndDelete(id);
  },
  getSingleUser: async (id: string) => {
    return await UserModel.findById(id);
  },
  getAllUser: async () => {
    return await UserModel.find();
  },
  findUserByEmail: async (email: string) => {
    return await UserModel.findOne({ email });
  },
  updateUserRefreshToken: async (id: string, refreshToken: string) => {
    return await UserModel.findByIdAndUpdate(id, { refresh_token: refreshToken });
  },
};
