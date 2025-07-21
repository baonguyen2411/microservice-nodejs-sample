import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../types/user';

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username must be less than 30 characters long'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in queries by default
    },
    photo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN', 'USER'],
        message: 'Role must be either ADMIN or USER',
      },
      default: 'USER',
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive', 'Suspended'],
        message: 'Status must be Active, Inactive, or Suspended',
      },
      default: 'Active',
    },
    refresh_token: {
      type: String,
      default: '',
      select: false, // Don't include refresh token in queries by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.refresh_token;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

// Compound index for commonly queried fields
userSchema.index({ email: 1, status: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
