import mongoose, { Schema } from 'mongoose';
import { IReviewDocument } from '../types/review';

const reviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IReviewDocument>('Review', reviewSchema);
