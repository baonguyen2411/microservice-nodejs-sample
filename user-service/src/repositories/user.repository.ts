import { UserModel } from '../models/User';
import { IUser, IUserDocument, IUpdateUserRequest } from '../types/user';
import { NotFoundError } from '../utils/errors';

export const UserRepository = {
  async createUser(user: IUser): Promise<IUserDocument> {
    const newUser = new UserModel(user);
    return await newUser.save();
  },

  async updateUser(id: string, updates: IUpdateUserRequest): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async deleteUser(id: string): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async getSingleUser(id: string): Promise<IUserDocument | null> {
    return await UserModel.findById(id);
  },

  async getUserById(id: string): Promise<IUserDocument> {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async getAllUser(): Promise<IUserDocument[]> {
    return await UserModel.find({ status: { $ne: 'Suspended' } }).sort({ createdAt: -1 });
  },

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email }).select('+password +refresh_token');
  },

  async findUserByUsername(username: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ username });
  },

  async updateUserRefreshToken(id: string, refreshToken: string): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { refresh_token: refreshToken },
      { new: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async getUserWithRefreshToken(id: string): Promise<IUserDocument> {
    const user = await UserModel.findById(id).select('+refresh_token');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async updateUserStatus(
    id: string,
    status: 'Active' | 'Inactive' | 'Suspended',
  ): Promise<IUserDocument> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async getUsersByRole(role: 'ADMIN' | 'USER'): Promise<IUserDocument[]> {
    return await UserModel.find({ role, status: { $ne: 'Suspended' } }).sort({ createdAt: -1 });
  },

  async searchUsers(query: string): Promise<IUserDocument[]> {
    return await UserModel.find({
      $and: [
        { status: { $ne: 'Suspended' } },
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });
  },
};
