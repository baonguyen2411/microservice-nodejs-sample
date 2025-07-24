import mongoose, { Schema } from 'mongoose';
import { IReviewDocument } from '../types/review';

const reviewSchema = new Schema<IReviewDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      index: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      required: [true, 'Tour ID is required'],
      index: true,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review text must be at least 10 characters long'],
      maxlength: [1000, 'Review text must be less than 1000 characters long'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value);
        },
        message: 'Rating must be an integer',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Create compound index to prevent duplicate reviews from same user for same tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// Create indexes for better query performance
reviewSchema.index({ tour: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<IReviewDocument>('Review', reviewSchema);